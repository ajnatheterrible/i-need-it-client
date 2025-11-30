import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Flex,
  Button,
  Image,
  Link,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar";

import useAuthStore from "../store/authStore";
import useFetchPurchases from "../hooks/useFetchPurchases";
import useFetchOrders from "../hooks/useFetchOrders";
import formatFullDate from "../utils/formatFullDate";

export default function Purchases() {
  const { loading: loadingPurchases } = useFetchPurchases();
  const { orders, loading: loadingOrders } = useFetchOrders();
  const purchases = useAuthStore((s) => s.fetchedData?.purchases);

  const getOrderForListing = (listingId) => {
    return orders?.find((order) => {
      const orderListingId =
        typeof order.listing === "string" ? order.listing : order.listing?._id;

      return orderListingId === listingId;
    });
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return price;

    const formatted = price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return price >= 1000 ? `$${formatted}` : `$${price}`;
  };

  const isLoading = loadingPurchases || loadingOrders;
  const hasPurchases = Array.isArray(purchases) && purchases.length > 0;

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            {isLoading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="60vh"
                w="full"
              >
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <VStack align="start" spacing={0} w="full">
                  <Heading size="lg" mb={8}>
                    Purchases
                  </Heading>

                  {!hasPurchases ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minH="40vh"
                      w="full"
                    >
                      <Text fontSize="sm" color="gray.500">
                        You haven&apos;t purchased anything yet
                      </Text>
                    </Box>
                  ) : (
                    purchases.map((item, i) => {
                      const order = getOrderForListing(item._id);

                      return (
                        <Box key={item._id} w="full">
                          <Box py={6}>
                            <Flex w="full" align="center" gap={6}>
                              <Flex flex={2} gap={4} align="center">
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  h="140px"
                                  w="120px"
                                  objectFit="cover"
                                  fallbackSrc="https://via.placeholder.com/140"
                                />
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="bold" fontSize="xs">
                                    {item.designer}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {item.title}
                                  </Text>
                                  <Text fontWeight="semibold" fontSize="xs">
                                    {formatPrice(item.price)}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {item.size}
                                  </Text>
                                </VStack>
                              </Flex>

                              <VStack
                                align="start"
                                spacing={1}
                                fontSize="xs"
                                flex={1}
                              >
                                <Text fontWeight="semibold">Purchased on</Text>
                                <Text color="gray.500">
                                  {item.createdAt
                                    ? formatFullDate(item.createdAt)
                                    : "—"}
                                </Text>
                              </VStack>

                              <VStack
                                align="start"
                                spacing={1}
                                fontSize="xs"
                                flex={1}
                              >
                                <Text fontWeight="semibold">Seller</Text>
                                <HStack>
                                  <Avatar
                                    size="xs"
                                    name={item.seller.username}
                                    bg="gray.200"
                                  />
                                  <Link as={RouterLink} to="#" fontSize="xs">
                                    {item.seller.username}
                                  </Link>
                                </HStack>
                              </VStack>

                              <VStack spacing={2} flex={1}>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  borderRadius="none"
                                >
                                  Edit Feedback
                                </Button>
                                <Button
                                  size="xs"
                                  variant="outline"
                                  borderRadius="none"
                                  as={RouterLink}
                                  to={order ? `/orders/${order._id}` : "#"}
                                  isDisabled={!order}
                                >
                                  Order Details
                                </Button>
                              </VStack>
                            </Flex>
                          </Box>

                          {i !== purchases.length - 1 && (
                            <Divider borderColor="gray.200" />
                          )}
                        </Box>
                      );
                    })
                  )}
                </VStack>
              </motion.div>
            )}
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
