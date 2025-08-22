import {
  Box,
  Text,
  Heading,
  VStack,
  Flex,
  Divider,
  Button,
  Image,
  HStack,
  Link as ChakraLink,
  Grid,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { PuffLoader } from "react-spinners";
import { useParams, Link as RouterLink } from "react-router-dom";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import formatFullDate from "../utils/formatFullDate";
import useFetchOrder from "../hooks/useFetchOrder";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { order, loading, error } = useFetchOrder(orderId);

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    const num = Number(value);
    return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const stepIndexFromStatus = (s) => {
    const val = (s || "").toUpperCase();
    if (val === "DELIVERED") return 2;
    if (val === "SHIPPED") return 0;
    if (val === "IN_TRANSIT" || val === "INTRANSIT") return 1;
    return -1;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        w="full"
      >
        <PuffLoader size={60} color="#666" />
      </Box>
    );
  }
  if (error) return <Text color="red.500">{error}</Text>;
  if (!order) return null;

  const listing = order?.listing || order?.listingSnapshot || {};
  const { shippingAddress, createdAt, status, seller, price } = order;
  const { listingPrice, shipping, tax, total } = price || {};

  const currentStep = stepIndexFromStatus(status);
  const shippedAt = order?.shippedAt || createdAt;
  const deliveredAt = order?.deliveredAt || null;

  const thumb =
    listing?.thumbnail ||
    listing?.images?.[0] ||
    "https://via.placeholder.com/160x160?text=Listing";

  return (
    <>
      <Container>
        <Heading mb={6} mt={10} size="lg">
          Order details
        </Heading>

        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1.05fr" }}
          gap={{ base: 10, lg: 24 }}
          alignItems="start"
        >
          {/* LEFT MAIN SECTION */}
          <Box minW={0}>
            <Flex
              p={4}
              bg="#fafafa"
              justify="space-between"
              align="center"
              mb={6}
              gap={4}
            >
              <HStack align="start" spacing={4}>
                <Image
                  src={thumb}
                  alt={listing?.title || "Listing thumbnail"}
                  boxSize="100px"
                  objectFit="cover"
                />
                <VStack align="start" spacing={1} mb={1}>
                  <Text fontSize="xs" color="gray.600">
                    Sold on {formatFullDate(createdAt)}
                  </Text>
                  <Text fontWeight="bold" fontSize="sm">
                    {listing?.designer?.name || listing?.designer || "—"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {listing?.title || "—"}
                  </Text>
                  <Text mt={1} fontWeight="semibold" fontSize="xs">
                    {formatPrice(listingPrice)}
                  </Text>
                </VStack>
              </HStack>
              <Button
                as={RouterLink}
                to={`/listing/${listing?._id || order?.listing}`}
                size="xs"
                variant="outline"
                borderRadius="none"
              >
                View Listing
              </Button>
            </Flex>

            <Box py={4} mb={6}>
              <Text fontWeight="bold" mb={4}>
                Delivery info
              </Text>

              <Box position="relative" px={2} py={2}>
                <Box
                  position="absolute"
                  top="20px"
                  left="calc(100% / 6)"
                  right="calc(100% / 6)"
                  height="2px"
                  bg="green.500"
                  zIndex={0}
                />

                <HStack justify="space-between" position="relative" zIndex={1}>
                  {[
                    {
                      label: "Shipped",
                      date: shippedAt,
                      isActive: currentStep >= 0,
                    },
                    {
                      label: "In Transit",
                      date: null,
                      isActive: currentStep >= 1,
                      renderBelow: () =>
                        order?.trackingNumber || order?.trackingUrl ? (
                          <ChakraLink
                            href={
                              order?.trackingUrl ||
                              `https://parcelsapp.com/en/tracking/${order?.trackingNumber}`
                            }
                            isExternal
                            fontSize="sm"
                            textDecoration="underline"
                          >
                            View Tracking
                          </ChakraLink>
                        ) : null,
                    },
                    {
                      label: "Delivered",
                      date: deliveredAt,
                      isActive: currentStep >= 2,
                    },
                  ].map((step, idx) => (
                    <VStack
                      key={idx}
                      spacing={1}
                      flex="1"
                      minW="100px"
                      align="center"
                    >
                      <Flex
                        align="center"
                        justify="center"
                        w="28px"
                        h="28px"
                        bg={step.isActive ? "green.600" : "gray.300"}
                        borderRadius="full"
                      >
                        <CheckIcon boxSize="14px" color="white" />
                      </Flex>
                      <Text
                        fontWeight={"bold"}
                        color={step.isActive ? "green.700" : "gray.400"}
                        mt={1}
                        mb={1}
                      >
                        {step.label}
                      </Text>
                      <Box minH="20px">
                        {typeof step.renderBelow === "function" &&
                          step.renderBelow()}
                      </Box>
                      <Box minH="20px">
                        {step.date && (
                          <Text fontSize="xs" color="gray.500">
                            {formatFullDate(step.date)}
                          </Text>
                        )}
                      </Box>
                    </VStack>
                  ))}
                </HStack>
              </Box>

              <Divider mt={6} />
            </Box>

            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: 10, lg: 10 }}
              alignItems="start"
            >
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Shipping to
                </Text>
                <VStack align="start" spacing={0} fontSize="sm">
                  <Text>{shippingAddress?.fullName || "—"}</Text>
                  <Text>{shippingAddress?.line1 || "—"}</Text>
                  {shippingAddress?.line2 && (
                    <Text>{shippingAddress.line2}</Text>
                  )}
                  <Text fontSize="xs" color="gray.600">
                    {shippingAddress?.city || "—"}
                    {shippingAddress?.state ? `, ${shippingAddress.state}` : ""}
                    {shippingAddress?.zip ? ` ${shippingAddress.zip}` : ""}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {shippingAddress?.country || ""}
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Payment
                </Text>
                <Text fontSize="sm">I Need It earned credit</Text>
              </Box>
            </Grid>

            <Divider mt={6} mb={6} />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold" mb={2}>
                Listing ID
              </Text>
              <Text fontSize="sm">{listing?._id}</Text>
            </VStack>

            <Divider mt={6} mb={6} />
            <VStack align="start" spacing={2}>
              <Text textAlign="center" fontSize="sm" w="full">
                This purchase may be covered by I Need It's Purchase Protection
                program
              </Text>
              <Text
                textAlign="center"
                fontSize="sm"
                w="full"
                textDecoration="underline"
              >
                {" "}
                Learn more
              </Text>
            </VStack>
          </Box>

          <Box w="100%" ml="auto" p={4} bg="white">
            <Text fontWeight="bold" mb={2}>
              Seller
            </Text>
            <VStack align="start" spacing={2}>
              <Text textDecoration="underline">{seller?.username || "—"}</Text>
              <Text color="gray.600" fontSize="sm">
                {order?.shippingFrom
                  ? `Ships from ${order.shippingFrom}`
                  : "Ships from"}
              </Text>
            </VStack>

            <Box py={4} mt={10}>
              <Text fontWeight="bold" mb={3}>
                Receipt
              </Text>
              <VStack spacing={1} align="stretch" fontSize="sm">
                <Flex justify="space-between">
                  <Text color="gray.600">Listing price</Text>
                  <Text fontWeight="semibold">{formatPrice(listingPrice)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Shipping</Text>
                  <Text fontWeight="semibold">{formatPrice(shipping)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="gray.600">Tax</Text>
                  <Text fontWeight="semibold">{formatPrice(tax)}</Text>
                </Flex>
                <Flex justify="space-between" fontWeight="semibold" mt={2}>
                  <Text fontWeight="bold" fontSize="md">
                    Order total
                  </Text>
                  <Text fontSize="md" fontWeight="bold">
                    {formatPrice(total)}
                  </Text>
                </Flex>
              </VStack>
              <VStack spacing={2} mt={16} align="stretch">
                <Button
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  fontWeight="bold"
                  borderRadius="none"
                >
                  View Tracking
                </Button>
                <Button variant="outline" borderRadius="none" fontWeight="bold">
                  Edit Feedback
                </Button>
                <Button variant="outline" borderRadius="none" fontWeight="bold">
                  Resell
                </Button>
              </VStack>
            </Box>
          </Box>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
