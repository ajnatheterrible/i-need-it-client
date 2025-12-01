import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Tooltip,
  useClipboard,
  Skeleton,
} from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiShare2, FiMapPin, FiAward, FiZap } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";

const getRatingColor = (rating) => {
  if (rating <= 1) return "red.400";
  if (rating <= 2) return "orange.400";
  return "green.400";
};

const getStarIcon = (rating, index) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  if (index <= fullStars) return FaStar;
  if (index === fullStars + 1 && hasHalfStar) return FaStarHalfAlt;
  return FaRegStar;
};

const isStarFilled = (rating, index) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  return index <= fullStars || (index === fullStars + 1 && hasHalfStar);
};

export default function SellerProfileHeader() {
  const url = window.location.href;
  const { onCopy } = useClipboard(url);
  const { user } = useAuthStore();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setLoadingStats(false);
      return;
    }

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch(`/api/feedback/seller/${user._id}/stats`);
        const data = res.ok ? await res.json() : null;
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user?._id]);

  const averageRating = stats?.ratingAverage || 0;
  const ratingCount = stats?.ratingCount || 0;

  const tagCounts = stats?.tagCounts || {};
  const hasTrustedSeller = (tagCounts.FAST_SHIPPER || 0) >= 10;
  const hasQuickResponder = (tagCounts.QUICK_REPLIES || 0) >= 10;

  const transactionsCount = stats?.transactionsCount || 0;

  const ratingColor = getRatingColor(averageRating);

  return (
    <Box w="full" pb={6}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6} alignItems="center">
        <GridItem colSpan={4}>
          <HStack spacing={4} align="center">
            <Avatar
              size="xl"
              src="/avatar.jpg"
              name={user?.username || ""}
              bg="gray.200"
              color="gray.700"
            />
            <VStack align="start" spacing={0}>
              <HStack spacing={1}>
                <Text fontWeight="bold" fontSize="2xl">
                  {user?.username || ""}
                </Text>
                {hasTrustedSeller && (
                  <Tooltip
                    label="Trusted seller"
                    hasArrow
                    bg="black"
                    color="white"
                    fontSize="xs"
                  >
                    <span>
                      <Icon as={FiAward} color="#6C63FF" boxSize={4} />
                    </span>
                  </Tooltip>
                )}
                {hasQuickResponder && (
                  <Tooltip
                    label="Quick responder"
                    hasArrow
                    bg="black"
                    color="white"
                    fontSize="xs"
                  >
                    <span>
                      <Icon as={FiZap} color="#6C63FF" boxSize={4} />
                    </span>
                  </Tooltip>
                )}
              </HStack>
              <Text fontSize="sm" color="gray.500">
                Joined in 2021
              </Text>
              <HStack spacing={1}>
                <Icon as={FiMapPin} boxSize={3.5} color="gray.500" />
                <Text fontSize="xs" color="gray.500">
                  United States
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem colSpan={6}>
          <HStack spacing={16}>
            <Box>
              {loadingStats ? (
                <VStack spacing={0} align="start">
                  <HStack spacing={1}>
                    <Skeleton height="14px" width="18px" />
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <Skeleton key={i} boxSize={3} borderRadius="full" />
                      ))}
                  </HStack>
                  <Skeleton height="12px" width="80px" mt={1} />
                </VStack>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <VStack spacing={0} align="start">
                    <HStack spacing={1}>
                      <RouterLink to="/feedback">
                        <Text
                          fontWeight="semibold"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {ratingCount > 0 ? averageRating.toFixed(1) : "—"}
                        </Text>
                      </RouterLink>
                      {[1, 2, 3, 4, 5].map((i) => {
                        const StarIcon = getStarIcon(averageRating, i);
                        const color = isStarFilled(averageRating, i)
                          ? ratingColor
                          : "gray.300";
                        return (
                          <Icon
                            key={i}
                            as={StarIcon}
                            color={color}
                            boxSize={3}
                          />
                        );
                      })}
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {ratingCount} review{ratingCount === 1 ? "" : "s"}
                    </Text>
                  </VStack>
                </motion.div>
              )}
            </Box>

            <VStack spacing={0} align="center">
              {loadingStats ? (
                <Skeleton height="16px" width="24px" />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Text fontWeight="semibold">{transactionsCount}</Text>
                </motion.div>
              )}
              <Text fontSize="xs" color="gray.500">
                transactions
              </Text>
            </VStack>

            <VStack spacing={0} align="center">
              <Text fontWeight="semibold">12</Text>
              <Text fontSize="xs" color="gray.500">
                followers
              </Text>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem colSpan={2} textAlign="right">
          <HStack justify="flex-end" spacing={3}>
            <Button
              as={RouterLink}
              to="/sell"
              size="xs"
              variant="outline"
              fontWeight="semibold"
              fontSize="xs"
            >
              + New Listing
            </Button>

            <Popover trigger="hover" placement="bottom-end">
              <PopoverTrigger>
                <Button size="xs" variant="ghost" p={2}>
                  <Icon as={FiShare2} boxSize={4} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                w="180px"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="md"
                _focus={{ boxShadow: "md" }}
              >
                <PopoverBody px={4} py={3}>
                  <VStack spacing={3} align="start">
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                    >
                      Share on Facebook
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                    >
                      Share on Twitter
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                      onClick={onCopy}
                    >
                      Copy link
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
