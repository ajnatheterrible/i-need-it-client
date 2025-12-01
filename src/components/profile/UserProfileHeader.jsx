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
  Link as ChakraLink,
  useClipboard,
  Tabs,
  TabList,
  Tab,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiAward, FiZap, FiShare2 } from "react-icons/fi";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";

export default function UserProfileHeader() {
  const url = window.location.href;
  const { onCopy } = useClipboard(url);
  const location = useLocation();
  const { user } = useAuthStore();

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      setLoadingStats(false);
      return;
    }

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch(`/api/feedback/seller/${userId}/stats`);
        const data = res.ok ? await res.json() : null;
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [userId]);

  const averageRating = stats?.ratingAverage || 0;
  const ratingCount = stats?.ratingCount || 0;
  const tagCounts = stats?.tagCounts || {};
  const transactionsCount = stats?.transactionsCount || 0;

  const hasTrustedSeller = (tagCounts.FAST_SHIPPER || 0) >= 10;
  const hasQuickResponder = (tagCounts.QUICK_REPLIES || 0) >= 10;

  const getActiveTab = () => {
    if (location.pathname === "/profile") return "Selling";
    if (location.pathname === "/profile/favorites") return "Favorites";
    if (location.pathname === "/profile/reviews") return "Reviews";
    return null;
  };

  const activeTab = getActiveTab();

  return (
    <Box w="full" pt={10}>
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
              <Text fontWeight="bold" fontSize="2xl">
                {user?.username || ""}
              </Text>
              {loadingStats ? (
                <Skeleton height="16px" width="140px" mt={1} />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <Text fontSize="sm" color="gray.600">
                    {transactionsCount} Transactions
                  </Text>
                </motion.div>
              )}
              <HStack spacing={1} pt={1}>
                <Text fontSize="xs" color="gray.500">
                  Joined in 2021
                </Text>
                <Icon as={FiMapPin} boxSize={3.5} color="gray.500" />
                <Text fontSize="xs" color="gray.500">
                  United States
                </Text>
              </HStack>
              <HStack pt={3} spacing={2}>
                {hasTrustedSeller && (
                  <Button
                    leftIcon={<FiAward />}
                    size="xs"
                    variant="ghost"
                    fontWeight="bold"
                    fontSize="xs"
                    colorScheme="purple"
                    bg="purple.50"
                  >
                    Trusted seller
                  </Button>
                )}
                {hasQuickResponder && (
                  <Button
                    leftIcon={<FiZap />}
                    size="xs"
                    variant="ghost"
                    fontWeight="bold"
                    fontSize="xs"
                    colorScheme="purple"
                    bg="purple.50"
                  >
                    Quick responder
                  </Button>
                )}
              </HStack>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem colSpan={6}>
          <HStack spacing={8} align="center">
            <Box>
              {loadingStats ? (
                <HStack spacing={4} align="center">
                  <HStack spacing={1} align="center">
                    <Skeleton boxSize={3.5} borderRadius="full" />
                    <Skeleton height="14px" width="32px" />
                  </HStack>
                  <Skeleton height="14px" width="100px" />
                </HStack>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <HStack spacing={8} align="center">
                    <HStack spacing={1} align="center">
                      <Icon as={FaStar} color="black" boxSize={3.5} />
                      <Text fontWeight="semibold" fontSize="sm">
                        {ratingCount > 0 ? averageRating.toFixed(1) : "—"}
                      </Text>
                    </HStack>
                    <Text fontWeight="semibold" fontSize="sm">
                      <ChakraLink
                        as={RouterLink}
                        to="/profile/reviews"
                        textDecor="underline"
                      >
                        {ratingCount} review{ratingCount === 1 ? "" : "s"}
                      </ChakraLink>
                    </Text>
                  </HStack>
                </motion.div>
              )}
            </Box>

            <Text fontWeight="semibold" fontSize="sm">
              5 following
            </Text>
            <Text fontWeight="semibold" fontSize="sm">
              12 followers
            </Text>
          </HStack>
        </GridItem>

        <GridItem colSpan={2}>
          <HStack justify="flex-end" spacing={2}>
            <Button
              variant="outline"
              size="xs"
              fontWeight="semibold"
              fontSize="xs"
              as={RouterLink}
              to="/profile-settings"
            >
              Edit Profile
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
                      Share on X
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

      <Box mt={8} borderBottom="1px solid" borderColor="gray.200">
        <Tabs variant="unstyled">
          <TabList>
            <Tab
              as={RouterLink}
              to="/profile"
              fontWeight={activeTab === "Selling" ? "semibold" : "normal"}
              borderBottom={
                activeTab === "Selling" ? "2px solid black" : "none"
              }
              fontSize="sm"
              mr={6}
            >
              Selling
            </Tab>
            <Tab
              as={RouterLink}
              to="/profile/favorites"
              fontWeight={activeTab === "Favorites" ? "semibold" : "normal"}
              borderBottom={
                activeTab === "Favorites" ? "2px solid black" : "none"
              }
              fontSize="sm"
              mr={6}
            >
              Favorites
            </Tab>
            <Tab
              as={RouterLink}
              to="/profile/reviews"
              fontWeight={activeTab === "Reviews" ? "semibold" : "normal"}
              borderBottom={
                activeTab === "Reviews" ? "2px solid black" : "none"
              }
              fontSize="sm"
              mr={6}
            >
              Reviews
            </Tab>
          </TabList>
        </Tabs>
      </Box>
    </Box>
  );
}
