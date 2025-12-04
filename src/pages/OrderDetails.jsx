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
  Tag,
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
import IssueRefundModal from "../components/modals/RefundModal";

const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useFetchOrder(orderId);
  const [localOrder, setLocalOrder] = useState(null);
  const effectiveOrder = localOrder || order || null;

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

  const {
    isOpen: isRefundOpen,
    onOpen: onRefundOpen,
    onClose: onRefundClose,
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
    return -1;
  };

  useEffect(() => {
    if (!loading && (error || !order)) {
      navigate("/404", { replace: true });
    }
  }, [loading, error, order, navigate]);

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
    refund,
    total_cents,
  } = effectiveOrder || {};

  const viewerUserId = currentUser?._id;
  const sellerId = seller && typeof seller === "object" ? seller._id : seller;
  const buyerId = buyer && typeof buyer === "object" ? buyer._id : buyer;

  const viewerIsSeller =
    !!viewerUserId && !!sellerId && String(sellerId) === String(viewerUserId);
  const viewerIsBuyer =
    !!viewerUserId && !!buyerId && String(buyerId) === String(viewerUserId);

  const baseStatus = (orderStatus || status || "").toUpperCase();

  const hasRefund = !!refund && !!refund.issuedAt;
  const totalCents = typeof total_cents === "number" ? total_cents : 0;
  const isFullRefund =
    hasRefund &&
    refund.mode === "full" &&
    typeof refund.amount_cents === "number" &&
    refund.amount_cents >= totalCents;
  const isPartialRefund = hasRefund && !isFullRefund;

  const wasDelivered =
    (status || "").toUpperCase() === "DELIVERED" ||
    statusHistory.some((h) => (h.status || "").toUpperCase() === "DELIVERED");
  const refundedBeforeDelivery = hasRefund && !wasDelivered;
  const escrowReleased = (escrow?.status || "").toUpperCase() === "RELEASED";

  useEffect(() => {
    if (!order || !order.status || !viewerIsBuyer) return;

    const base = (order.status || "").toUpperCase();
    const eligible = ["PAID", "SHIPPED", "IN TRANSIT", "DELIVERED"];
    if (!eligible.includes(base)) return;

    const wasRefunded = !!order.refund && !!order.refund.issuedAt;
    const delivered =
      base === "DELIVERED" ||
      (order.statusHistory || []).some(
        (h) => (h.status || "").toUpperCase() === "DELIVERED"
      );

    if (wasRefunded && !delivered) return;

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
  }, [orderId, token, order, viewerIsBuyer]);

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

  const refundedAmount = hasRefund ? (refund.amount_cents || 0) / 100 : 0;
  const sellerDebit = hasRefund ? (refund.sellerDebit_cents || 0) / 100 : 0;

  const sellerFinalNet = hasRefund
    ? escrowReleased
      ? Math.max(0, netEarnings - sellerDebit)
      : 0
    : netEarnings;

  if (loading || !effectiveOrder) {
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

  if (error || !effectiveOrder) {
    return null;
  }

  const listing =
    effectiveOrder?.listing || effectiveOrder?.listingSnapshot || {};
  const buyerStepIndex = refundedBeforeDelivery
    ? -1
    : buyerStepIndexFromStatus(orderStatus || status);

  let sellerStepIndex = -1;
  if (baseStatus === "SHIPPED") sellerStepIndex = 0;
  if (baseStatus === "DELIVERED") sellerStepIndex = 1;
  if (escrowReleased) sellerStepIndex = 2;

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

  const maxRefundAmount = total || 0;

  const handleIssueRefund = async (payload) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
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
        const msg =
          data?.message ||
          "Something went wrong while issuing the refund. Please try again.";
        return { success: false, error: msg };
      }

      if (data && data.order) {
        setLocalOrder((prev) => {
          const base = prev || order || {};
          return {
            ...base,
            ...data.order,
            listing: data.order.listing || base.listing,
            listingSnapshot: data.order.listingSnapshot || base.listingSnapshot,
          };
        });
      }

      return { success: true };
    } catch (err) {
      const msg =
        err?.message ||
        "Something went wrong while issuing the refund. Please try again.";
      return { success: false, error: msg };
    }
  };

  return (
    <>
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Flex mb={6} mt={10} align="center" justify="space-between">
            <Heading size="lg">Order details</Heading>
            {hasRefund && (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme={isFullRefund ? "red" : "yellow"}
              >
                {isFullRefund ? "Refunded" : "Partially refunded"}
              </Tag>
            )}
          </Flex>
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
                  to={`/listing/${listing?._id || effectiveOrder?.listing}`}
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
                    {effectiveOrder?.shippingFrom
                      ? `Ships from ${effectiveOrder.shippingFrom}`
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
                        {hasRefund && escrowReleased
                          ? "Net after refund (USD)"
                          : "Total earnings (USD)"}
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={!hasRefund ? "green.500" : "gray.800"}
                      >
                        {formatPrice(sellerFinalNet)}
                      </Text>
                    </Flex>
                    {hasRefund && (
                      <VStack align="stretch" spacing={1} mt={2} fontSize="xs">
                        <Flex justify="space-between">
                          <Text color="gray.600">Refunded to buyer</Text>
                          <Text fontWeight="semibold" color="red.500">
                            -{formatPrice(refundedAmount)}
                          </Text>
                        </Flex>
                        {sellerDebit > 0 && (
                          <Flex justify="space-between">
                            <Text color="gray.600">
                              Debited from your wallet
                            </Text>
                            <Text fontWeight="semibold" color="red.500">
                              -{formatPrice(sellerDebit)}
                            </Text>
                          </Flex>
                        )}
                      </VStack>
                    )}
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
                    {hasRefund && (
                      <VStack align="stretch" spacing={1} mt={2} fontSize="xs">
                        <Flex justify="space-between">
                          <Text color="gray.600">
                            {isFullRefund
                              ? "Refunded to you"
                              : "Partial refund to you"}
                          </Text>
                          <Text fontWeight="semibold" color="red.500">
                            -{formatPrice(refundedAmount)}
                          </Text>
                        </Flex>
                      </VStack>
                    )}
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
                      {!hasRefund && (
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
                          onClick={onRefundOpen}
                        >
                          Issue Refund
                        </MotionButton>
                      )}
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
                      {!isFullRefund && (
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
                      )}
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
      <IssueRefundModal
        isOpen={isRefundOpen}
        onClose={onRefundClose}
        maxRefundAmount={maxRefundAmount}
        onSubmit={handleIssueRefund}
      />
    </>
  );
}
