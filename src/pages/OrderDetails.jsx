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
  Grid,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import useAuthStore from "../store/authStore";
import formatFullDate from "../utils/formatFullDate";
import useFetchOrder from "../hooks/useFetchOrder";

const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useFetchOrder(orderId);
  const [orderStatus, setOrderStatus] = useState(null);
  const token = useAuthStore((s) => s.token);

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    const num = Number(value);
    return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const stepIndexFromStatus = (s) => {
    const val = (s || "").toUpperCase();
    if (val === "DELIVERED") return 2;
    if (val === "IN TRANSIT") return 1;
    if (val === "SHIPPED") return 0;
    return 0;
  };

  useEffect(() => {
    if (!loading && (error || !order)) {
      navigate("/404", { replace: true });
    }
  }, [loading, error, order, navigate]);

  useEffect(() => {
    if (!order || !order.status) return;

    const triggerBackendSimulation = async () => {
      try {
        await fetch(`/api/orders/${orderId}/simulate`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Simulation failed", err);
      }
    };

    triggerBackendSimulation();

    const sequence = ["SHIPPED", "IN TRANSIT", "DELIVERED"];
    let idx = 0;
    setOrderStatus(sequence[idx]);
    const interval = setInterval(() => {
      idx++;
      if (idx < sequence.length) {
        setOrderStatus(sequence[idx]);
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, token, order]);

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

  if (error || !order) {
    return null;
  }

  const listing = order?.listing || order?.listingSnapshot || {};
  const { shippingAddress, createdAt, status, seller, price } = order;
  const { listingPrice, shipping, tax, total } = price || {};
  const currentStep = stepIndexFromStatus(orderStatus || status);
  const shippedAt =
    order.statusHistory.find((h) => h.status === "SHIPPED")?.updatedAt || null;
  const deliveredAt =
    order.statusHistory.find((h) => h.status === "DELIVERED")?.updatedAt ||
    null;
  const totalSteps = 3;
  const startOffsetPct = 100 / (totalSteps * 2);
  const widthPct =
    (Math.max(0, Math.min(currentStep, totalSteps - 1)) * 100) / totalSteps;
  const thumb =
    listing?.thumbnail ||
    listing?.images?.[0] ||
    "https://via.placeholder.com/160x160?text=Listing";

  return (
    <>
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Heading mb={6} mt={10} size="lg">
            Order details
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1.05fr" }}
            gap={{ base: 10, lg: 24 }}
            alignItems="start"
          >
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
                  <MotionBox
                    position="absolute"
                    top="20px"
                    left={`${startOffsetPct}%`}
                    height="2px"
                    bg="green.500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${widthPct}%` }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    zIndex={0}
                  />
                  <HStack
                    justify="space-between"
                    position="relative"
                    zIndex={1}
                  >
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
                        <MotionFlex
                          align="center"
                          justify="center"
                          w="28px"
                          h="28px"
                          borderRadius="full"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{
                            scale: step.isActive ? 1 : 0.8,
                            opacity: step.isActive ? 1 : 0.5,
                            backgroundColor: step.isActive
                              ? "rgb(22, 163, 74)"
                              : "rgb(209, 213, 219)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                          }}
                        >
                          <CheckIcon boxSize="14px" color="white" />
                        </MotionFlex>
                        <MotionText
                          fontWeight="bold"
                          mt={1}
                          mb={1}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: step.isActive ? 1 : 0.5,
                            color: step.isActive
                              ? "rgb(21, 128, 61)"
                              : "#9CA3AF",
                          }}
                          transition={{
                            duration: 0.4,
                            delay: step.isActive ? 0.2 : 0,
                          }}
                        >
                          {step.label}
                        </MotionText>
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
                      {shippingAddress?.state
                        ? `, ${shippingAddress.state}`
                        : ""}
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
                  This purchase may be covered by I Need It's Purchase
                  Protection program
                </Text>
                <Text
                  textAlign="center"
                  fontSize="sm"
                  w="full"
                  textDecoration="underline"
                >
                  Learn more
                </Text>
              </VStack>
            </Box>

            <Box w="100%" ml="auto" p={4} bg="white">
              <Text fontWeight="bold" mb={2}>
                Seller
              </Text>
              <VStack align="start" spacing={2}>
                <Text textDecoration="underline">
                  {seller?.username || "—"}
                </Text>
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
                    <Text fontWeight="semibold">
                      {formatPrice(listingPrice)}
                    </Text>
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
                  <MotionButton
                    variant="outline"
                    borderRadius="none"
                    fontWeight="bold"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    Edit Feedback
                  </MotionButton>
                  <MotionButton
                    variant="outline"
                    borderRadius="none"
                    fontWeight="bold"
                    initial={false}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                  >
                    Resell
                  </MotionButton>
                </VStack>
              </Box>
            </Box>
          </Grid>
        </motion.div>
      </Container>
      <Footer />
    </>
  );
}
