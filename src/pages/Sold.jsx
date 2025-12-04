import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Flex,
  Button,
  Image,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

import useAuthStore from "../store/authStore";
import { formatCurrency } from "../utils/priceUtils";
import formatFullDate from "../utils/formatFullDate";

const formatOrderStatus = (order) => {
  const status = (order?.status || "").toString().toUpperCase();
  const hasRefund = !!order?.refund?.issuedAt;
  const refundMode = (order?.refund?.mode || "").toLowerCase();

  if (hasRefund && status === "DELIVERED") {
    if (refundMode === "partial") return "Partially refunded";
    return "Refunded";
  }

  if (!status) return "Paid";
  if (status === "PAID") return "Ready to ship";
  if (status === "SHIPPED") return "Shipped";
  if (status === "DELIVERED") return "Paid to your bank";
  if (status === "CANCELED" || status === "CANCELLED") return "Canceled";

  return status.charAt(0) + status.slice(1).toLowerCase();
};

const getStatusColor = (order) => {
  const status = (order?.status || "").toString().toUpperCase().trim();
  const hasRefund = !!order?.refund?.issuedAt;

  if (hasRefund && status === "DELIVERED") return "red.500";
  if (!status) return "green.600";
  if (status === "PAID") return "orange.400";
  if (status === "SHIPPED" || status === "DELIVERED") return "green.600";

  return "green.600";
};

const formatAddress = (addr = {}) => {
  const lines = [
    addr.line1,
    addr.line2,
    [addr.city, addr.state, addr.zip].filter(Boolean).join(" "),
    addr.country,
  ].filter(Boolean);
  return lines.join("\n");
};

export default function Sold() {
  const token = useAuthStore((s) => s.token);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Missing access token");
      return;
    }

    const fetchSold = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/users/sold", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 404) {
          setSales([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load sold items");
        }

        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Failed to load sold items");
      } finally {
        setLoading(false);
      }
    };

    fetchSold();
  }, [token]);

  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            pt={6}
            pb={10}
            w="full"
          >
            <GridItem colSpan={2}>
              <SellerSidebar active="SOLD" />
            </GridItem>

            <GridItem colSpan={10}>
              {loading ? (
                <VStack align="start" spacing={4} w="full">
                  <Heading size="md">Sold</Heading>

                  {Array.from({ length: 2 }).map((_, i) => (
                    <Box key={i} w="full">
                      <Box py={6}>
                        <Flex w="full" align="center" gap={6}>
                          <Flex flex={2} gap={4} align="center">
                            <Skeleton h="140px" w="120px" />

                            <VStack align="start" spacing={2} w="260px">
                              <Skeleton h="10px" w="90px" />
                              <Skeleton h="10px" w="110px" />
                              <Skeleton h="10px" w="220px" />
                              <Skeleton h="10px" w="70px" />
                              <Skeleton h="10px" w="40px" />
                            </VStack>
                          </Flex>

                          <VStack
                            align="start"
                            spacing={2}
                            fontSize="xs"
                            flex={1}
                          >
                            <Skeleton h="10px" w="100px" />
                            <Skeleton h="10px" w="150px" />
                            <Skeleton h="10px" w="150px" />
                          </VStack>

                          <VStack
                            align="start"
                            spacing={2}
                            fontSize="xs"
                            flex={1}
                          >
                            <Skeleton h="10px" w="50px" />
                            <Skeleton h="10px" w="130px" />
                          </VStack>

                          <VStack spacing={2} flex={1}>
                            <Skeleton h="28px" w="110px" />
                            <Skeleton h="28px" w="110px" />
                          </VStack>
                        </Flex>
                      </Box>

                      {i !== 1 && <Divider borderColor="gray.200" />}
                    </Box>
                  ))}
                </VStack>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <VStack align="start" spacing={4} w="full">
                    <Heading size="md">Sold</Heading>

                    {error && (
                      <Box mb={2}>
                        <Text fontSize="sm" color="red.500">
                          {error}
                        </Text>
                      </Box>
                    )}

                    {!error && sales.length === 0 && (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minH="40vh"
                        w="full"
                      >
                        <Text fontSize="sm" color="gray.500">
                          You haven&apos;t sold anything yet
                        </Text>
                      </Box>
                    )}

                    {!error &&
                      sales.map((order, i) => {
                        const listing = order.listing || {};
                        const shippingAddress = order.shippingAddress || {};
                        const rawPrice =
                          order.price?.listingPrice ?? listing.price ?? 0;

                        let priceValue = "0";
                        if (typeof rawPrice === "string") priceValue = rawPrice;
                        else if (typeof rawPrice === "number")
                          priceValue = rawPrice.toString();

                        const buyerName =
                          shippingAddress.fullName ||
                          order.buyer?.username ||
                          "";

                        const listingId =
                          typeof order.listing === "string"
                            ? order.listing
                            : listing._id;

                        const listingUrl = listingId
                          ? `/listing/${listingId}`
                          : "#";

                        const statusLabel = formatOrderStatus(order);
                        const statusColor = getStatusColor(order);

                        return (
                          <Box key={order._id} w="full">
                            <Box py={6}>
                              <Flex w="full" align="center" gap={6}>
                                <Flex flex={2} gap={4} align="center">
                                  <RouterLink to={listingUrl}>
                                    <Image
                                      src={
                                        listing.thumbnail ||
                                        listing.imageUrl ||
                                        "https://via.placeholder.com/140"
                                      }
                                      alt={listing.title || "Listing"}
                                      h="140px"
                                      w="120px"
                                      objectFit="cover"
                                    />
                                  </RouterLink>
                                  <VStack align="start" spacing={1}>
                                    <Text
                                      fontSize="xs"
                                      fontWeight="semibold"
                                      color={statusColor}
                                    >
                                      {statusLabel}
                                    </Text>
                                    <Text fontWeight="bold" fontSize="xs">
                                      {listing.designer || ""}
                                    </Text>
                                    <Text
                                      as={RouterLink}
                                      to={listingUrl}
                                      fontSize="xs"
                                      color="gray.600"
                                      noOfLines={1}
                                      maxW="260px"
                                      _hover={{ textDecoration: "underline" }}
                                    >
                                      {listing.title || "Listing title"}
                                    </Text>
                                    <Text fontWeight="semibold" fontSize="xs">
                                      {formatCurrency(priceValue)}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {listing.size || ""}
                                    </Text>
                                  </VStack>
                                </Flex>

                                <VStack
                                  align="start"
                                  spacing={1}
                                  fontSize="xs"
                                  flex={1}
                                >
                                  <Text fontWeight="semibold">
                                    Shipping details
                                  </Text>
                                  <Text>{buyerName}</Text>
                                  <Text whiteSpace="pre-wrap">
                                    {formatAddress(shippingAddress)}
                                  </Text>
                                </VStack>

                                <VStack
                                  align="start"
                                  spacing={1}
                                  fontSize="xs"
                                  flex={1}
                                >
                                  <Text fontWeight="semibold">Sold</Text>
                                  <Text color="gray.500">
                                    {order.createdAt
                                      ? formatFullDate(order.createdAt)
                                      : "—"}
                                  </Text>
                                </VStack>

                                <VStack spacing={2} flex={1}>
                                  <Button
                                    size="xs"
                                    variant="solid"
                                    colorScheme="blackAlpha"
                                    borderRadius="none"
                                    fontWeight="semibold"
                                    fontSize="xs"
                                    as={RouterLink}
                                    to={`/orders/${order._id}`}
                                  >
                                    View Tracking
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    borderRadius="none"
                                    fontWeight="semibold"
                                    fontSize="xs"
                                    as={RouterLink}
                                    to={`/orders/${order._id}`}
                                  >
                                    Order Details
                                  </Button>
                                </VStack>
                              </Flex>
                            </Box>

                            {i !== sales.length - 1 && (
                              <Divider borderColor="gray.200" />
                            )}
                          </Box>
                        );
                      })}
                  </VStack>
                </motion.div>
              )}
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </>
  );
}
