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
  useDisclosure,
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
import ReviewModal from "../components/modals/ReviewModal";

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
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currentUser = useAuthStore((s) => s.user);

  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();

  const formatPrice = (value) => {
    if (value == null || isNaN(value)) return "$0.00";
    const num = Number(value);
    return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const buyerStepIndexFromStatus = (s) => {
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

  const {
    shippingAddress,
    createdAt,
    status,
    seller,
    buyer,
    price,
    statusHistory = [],
    escrow,
    trackingNumber,
  } = order || {};

  const viewerUserId = currentUser?._id;
  const sellerId = seller && typeof seller === "object" ? seller._id : seller;
  const buyerId = buyer && typeof buyer === "object" ? buyer._id : buyer;

  const viewerIsSeller =
    !!viewerUserId && !!sellerId && String(sellerId) === String(viewerUserId);
  const viewerIsBuyer =
    !!viewerUserId && !!buyerId && String(buyerId) === String(viewerUserId);

  useEffect(() => {
    if (!isLoggedIn || !token || !order || !viewerIsBuyer) return;

    const fetchReview = async () => {
      try {
        setReviewLoading(true);
        const res = await fetch(`/api/feedback/order/${orderId}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setReview(null);
          return;
        }

        const data = await res.json();
        setReview(data);
      } catch (err) {
        console.error("Failed to fetch review", err);
        setReview(null);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReview();
  }, [isLoggedIn, token, order, orderId, viewerIsBuyer]);

  const { listingPrice, shipping, tax, total } = price || {};

  const listingCents = Math.round((listingPrice || 0) * 100);
  const shippingCents = Math.round((shipping || 0) * 100);
  const taxCents = Math.round((tax || 0) * 100);
  const feeCents = Math.round(listingCents * 0.09);
  const shippingTaxCents = shippingCents + taxCents;
  const netCents = Math.max(0, listingCents - feeCents - shippingTaxCents);

  const marketplaceFee = feeCents / 100;
  const shippingTaxDeduction = shippingTaxCents / 100;
  const netEarnings = netCents / 100;

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
  const buyerStepIndex = buyerStepIndexFromStatus(orderStatus || status);
  const baseStatus = (orderStatus || status || "").toUpperCase();

  let sellerStepIndex = 0;
  if (baseStatus === "DELIVERED") sellerStepIndex = 1;
  if (escrow?.status === "RELEASED") sellerStepIndex = 2;

  const currentStep = viewerIsSeller ? sellerStepIndex : buyerStepIndex;

  const shippedAt =
    statusHistory.find((h) => h.status === "SHIPPED")?.updatedAt || null;
  const deliveredAt =
    statusHistory.find((h) => h.status === "DELIVERED")?.updatedAt || null;
  const paidOutAt = escrow?.releasedAt || null;

  const totalSteps = 3;
  const startOffsetPct = 100 / (totalSteps * 2);
  const widthPct =
    (Math.max(0, Math.min(currentStep, totalSteps - 1)) * 100) / totalSteps;
  const thumb =
    listing?.thumbnail ||
    listing?.images?.[0] ||
    "https://via.placeholder.com/160x160?text=Listing";

  const canLeaveFeedback =
    viewerIsBuyer &&
    (orderStatus || status || "").toUpperCase() === "DELIVERED";

  const handleOpenReview = () => {
    if (!isLoggedIn) return;
    if (!canLeaveFeedback) return;
    onReviewOpen();
  };

  const handleSubmitReview = async (payload) => {
    const url = review
      ? `/api/feedback/${review._id}`
      : `/api/feedback/${orderId}`;
    const method = review ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (e) {}

    if (!res.ok) {
      const msg = data?.message || "Failed to submit review";
      throw new Error(msg);
    }

    setReview(data);
    return { success: true };
  };

  const buyerUsername =
    (buyer && typeof buyer === "object" && buyer.username) ||
    shippingAddress?.fullName ||
    "—";

  const steps = viewerIsSeller
    ? [
        {
          label: "Shipped",
          date: shippedAt,
          isActive: sellerStepIndex >= 0,
        },
        {
          label: "Delivered",
          date: deliveredAt,
          isActive: sellerStepIndex >= 1,
        },
        {
          label: "Paid to your Wallet",
          date: paidOutAt,
          isActive: sellerStepIndex >= 2,
        },
      ]
    : [
        {
          label: "Shipped",
          date: shippedAt,
          isActive: buyerStepIndex >= 0,
        },
        {
          label: "In Transit",
          date: null,
          isActive: buyerStepIndex >= 1,
          showTracking: !!trackingNumber,
        },
        {
          label: "Delivered",
          date: deliveredAt,
          isActive: buyerStepIndex >= 2,
        },
      ];

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
                    <Text fontWeight="bold" fontSize="xs">
                      {listing?.designer?.name || listing?.designer || "—"}
                    </Text>
                    <Text fontSize="xs" color="gray.700">
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
                    {steps.map((step, idx) => (
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
                          fontSize="sm"
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
                        <Box minH="32px">
                          {step.date && (
                            <Text fontSize="xs" color="gray.500">
                              {formatFullDate(step.date)}
                            </Text>
                          )}
                          {!viewerIsSeller &&
                            step.showTracking &&
                            trackingNumber && (
                              <Text
                                fontSize="xs"
                                color="gray.500"
                                textDecoration="underline"
                                mt={step.date ? 0 : 1}
                              >
                                View Tracking
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
                    {viewerIsSeller ? "Shipping details" : "Shipping to"}
                  </Text>
                  <VStack align="start" spacing={0} fontSize="xs">
                    <Text>{shippingAddress?.fullName || "—"}</Text>
                    <Text>{shippingAddress?.line1 || "—"}</Text>
                    {shippingAddress?.line2 && (
                      <Text>{shippingAddress.line2}</Text>
                    )}
                    <Text color="gray.600">
                      {shippingAddress?.city || "—"}
                      {shippingAddress?.state
                        ? `, ${shippingAddress.state}`
                        : ""}
                      {shippingAddress?.zip ? ` ${shippingAddress.zip}` : ""}
                    </Text>
                    <Text color="gray.600">
                      {shippingAddress?.country || ""}
                    </Text>
                  </VStack>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    {viewerIsSeller ? "Listing ID" : "Payment"}
                  </Text>
                  {viewerIsSeller ? (
                    <VStack align="start" spacing={1} fontSize="xs">
                      <Text>{listing?._id}</Text>
                    </VStack>
                  ) : (
                    <Text fontSize="xs">I Need It earned credit</Text>
                  )}
                </Box>
              </Grid>

              {!viewerIsSeller && (
                <>
                  <Divider mt={6} mb={6} />
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" mb={2}>
                      Listing ID
                    </Text>
                    <Text fontSize="xs">{listing?._id}</Text>
                  </VStack>
                </>
              )}

              <Divider mt={6} mb={6} />
              <VStack align="start" spacing={2}>
                <Text textAlign="center" fontSize="xs" w="full">
                  This purchase may be covered by I Need It's Purchase
                  Protection program
                </Text>
                <Text
                  textAlign="center"
                  fontSize="xs"
                  w="full"
                  textDecoration="underline"
                >
                  Learn more
                </Text>
              </VStack>
            </Box>

            <Box w="100%" ml="auto" p={4} bg="white">
              <Text fontWeight="bold" mb={2}>
                {viewerIsSeller ? "Buyer" : "Seller"}
              </Text>
              <VStack align="start" spacing={2} fontSize="sm">
                <Text textDecoration="underline">
                  {viewerIsSeller ? buyerUsername : seller?.username || "—"}
                </Text>
                {!viewerIsSeller && (
                  <Text color="gray.600" fontSize="xs">
                    {order?.shippingFrom
                      ? `Ships from ${order.shippingFrom}`
                      : "Ships from"}
                  </Text>
                )}
              </VStack>

              <Box py={4} mt={10}>
                <Text fontWeight="bold" mb={3}>
                  {viewerIsSeller ? "Earnings" : "Receipt"}
                </Text>
                {viewerIsSeller ? (
                  <VStack spacing={1} align="stretch" fontSize="sm">
                    <Flex justify="space-between">
                      <Text color="gray.600">Sold price</Text>
                      <Text fontWeight="semibold">
                        {formatPrice(listingPrice)}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Shipping</Text>
                      <Text fontWeight="semibold">{formatPrice(shipping)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">I Need It fee (9%)</Text>
                      <Text fontWeight="semibold">
                        -{formatPrice(marketplaceFee)}
                      </Text>
                    </Flex>
                    {shippingTaxDeduction > 0 && (
                      <Flex justify="space-between">
                        <Text color="gray.600">Shipping + tax deductions</Text>
                        <Text fontWeight="semibold">
                          -{formatPrice(shippingTaxDeduction)}
                        </Text>
                      </Flex>
                    )}
                    <Flex justify="space-between" fontWeight="semibold" mt={2}>
                      <Text fontWeight="bold" fontSize="md">
                        Total earnings (USD)
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color="green.500">
                        {formatPrice(netEarnings)}
                      </Text>
                    </Flex>
                  </VStack>
                ) : (
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
                )}

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

                  {viewerIsSeller ? (
                    <>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        Edit Tracking
                      </MotionButton>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.05,
                        }}
                      >
                        Issue Refund
                      </MotionButton>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                      >
                        Duplicate Listing
                      </MotionButton>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.15,
                        }}
                      >
                        Contact Support
                      </MotionButton>
                    </>
                  ) : (
                    <>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        isDisabled={!canLeaveFeedback || reviewLoading}
                        onClick={handleOpenReview}
                      >
                        {review ? "Edit Feedback" : "Leave Feedback"}
                      </MotionButton>
                      <MotionButton
                        variant="outline"
                        borderRadius="none"
                        fontWeight="bold"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                          delay: 0.15,
                        }}
                      >
                        Resell
                      </MotionButton>
                    </>
                  )}
                </VStack>
              </Box>
            </Box>
          </Grid>
        </motion.div>
      </Container>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={onReviewClose}
        mode={review ? "edit" : "create"}
        initialReview={
          review
            ? {
                rating: review.rating,
                tags: review.tags || [],
                comment: review.comment || "",
              }
            : null
        }
        onSubmit={handleSubmitReview}
      />
      <Footer />
    </>
  );
}
