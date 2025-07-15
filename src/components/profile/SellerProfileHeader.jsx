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
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiShare2, FiMapPin, FiAward, FiZap } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function SellerProfileHeader() {
  const url = window.location.href;
  const { onCopy } = useClipboard(url);
  const { user } = useAuthStore();

  return (
    <Box w="full" pb={6}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6} alignItems="center">
        <GridItem colSpan={4}>
          <HStack spacing={4} align="center">
            <Avatar
              size="xl"
              src="/avatar.jpg"
              name="amnesia_"
              bg="gray.200"
              color="gray.700"
            />
            <VStack align="start" spacing={0}>
              <HStack spacing={1}>
                <Text fontWeight="bold" fontSize="2xl">
                  {user.username}
                </Text>
                <Tooltip
                  label="Trusted Seller"
                  hasArrow
                  bg="black"
                  color="white"
                  fontSize="xs"
                >
                  <span>
                    <Icon as={FiAward} color="#6C63FF" boxSize={4} />
                  </span>
                </Tooltip>
                <Tooltip
                  label="Quick Responder"
                  hasArrow
                  bg="black"
                  color="white"
                  fontSize="xs"
                >
                  <span>
                    <Icon as={FiZap} color="#6C63FF" boxSize={4} />
                  </span>
                </Tooltip>
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
          <HStack spacing={10}>
            <VStack spacing={0} align="start">
              <HStack spacing={1}>
                <RouterLink to="/feedback">
                  <Text
                    fontWeight="semibold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    4.9
                  </Text>
                </RouterLink>
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} as={FaStar} color="#DCEF31" boxSize={3} />
                ))}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                16 Reviews
              </Text>
            </VStack>

            <VStack spacing={0} align="center">
              <Text fontWeight="semibold">41</Text>
              <Text fontSize="xs" color="gray.500">
                Transactions
              </Text>
            </VStack>

            <VStack spacing={0} align="center">
              <Text fontWeight="semibold">12</Text>
              <Text fontSize="xs" color="gray.500">
                Followers
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
              colorScheme="gray"
              variant="solid"
            >
              + NEW LISTING
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
                      fontWeight="bold"
                      textTransform="uppercase"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                    >
                      Share on Facebook
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      textTransform="uppercase"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                    >
                      Share on Twitter
                    </Text>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      textTransform="uppercase"
                      cursor="pointer"
                      _hover={{ color: "gray.600" }}
                      onClick={onCopy}
                    >
                      Copy Link
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
