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
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiAward, FiZap, FiShare2 } from "react-icons/fi";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";

export default function UserProfileHeader() {
  const url = window.location.href;
  const { onCopy } = useClipboard(url);
  const location = useLocation();
  const { user } = useAuthStore();

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
              name="amnesia_"
              bg="gray.200"
              color="gray.700"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="2xl">
                {user.username}
              </Text>
              <Text fontSize="sm" color="gray.600">
                41 Transactions
              </Text>
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
                <Button
                  leftIcon={<FiAward />}
                  size="xs"
                  variant="ghost"
                  fontWeight="bold"
                  fontSize="xs"
                  colorScheme="purple"
                  bg="purple.50"
                >
                  Trusted Seller
                </Button>
                <Button
                  leftIcon={<FiZap />}
                  size="xs"
                  variant="ghost"
                  fontWeight="bold"
                  fontSize="xs"
                  colorScheme="purple"
                  bg="purple.50"
                >
                  Quick Responder
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </GridItem>

        <GridItem colSpan={6}>
          <HStack spacing={8}>
            <HStack spacing={1}>
              <Icon as={FaStar} color="black" boxSize={3.5} />
              <Text fontWeight="semibold" fontSize="sm">
                4.9{" "}
                <ChakraLink
                  as={RouterLink}
                  to="/profile/reviews"
                  textDecor="underline"
                >
                  16 Reviews
                </ChakraLink>
              </Text>
            </HStack>
            <Text fontWeight="semibold" fontSize="sm">
              5 Following
            </Text>
            <Text fontWeight="semibold" fontSize="sm">
              12 Followers
            </Text>
          </HStack>
        </GridItem>

        <GridItem colSpan={2}>
          <HStack justify="flex-end" spacing={2}>
            <Button
              variant="outline"
              size="xs"
              fontWeight="bold"
              fontSize="xs"
              as={RouterLink}
              to="/profile-settings"
            >
              EDIT PROFILE
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
                      Share on X
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
