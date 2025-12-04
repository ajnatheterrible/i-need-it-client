import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
  useDisclosure,
  Avatar,
  IconButton,
  Img,
  Flex,
} from "@chakra-ui/react";
import { WarningIcon, StarIcon } from "@chakra-ui/icons";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useEffect, useState, useRef } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

import useFetchFavorites from "../hooks/useFetchFavorites";
import { toggleFavorite } from "../utils/favoriteUtils";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import { PurchaseProtection } from "../components/ui/PurchaseProtection";
import KlarnaAffirmButton from "../components/ui/KlarnaAffirmButton";
import KlarnaAffirmModal from "../components/ui/KlarnaAffirmModal";
import OfferModal from "../components/modals/OfferModal";
import MessageModal from "../components/modals/MessageModal";
import BroadcastOfferModal from "../components/modals/BroadcastOfferModal";
import ListingSkeleton from "../components/skeletons/ListingSkeleton";
import ReviewModal from "../components/modals/ReviewModal";

import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const favorites = useAuthStore((s) => s.fetchedData?.favorites);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const onOpenAuthModal = useAuthModal();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeSellerOffer, setActiveSellerOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const [listingOrderId, setListingOrderId] = useState(null);
  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();

  const {
    isOpen: isMessageOpen,
    onOpen: onMessageOpen,
    onClose: onMessageClose,
  } = useDisclosure();

  const {
    isOpen: isKlarnaOpen,
    onOpen: onKlarnaOpen,
    onClose: onKlarnaClose,
  } = useDisclosure();

  const {
    isOpen: isBroadcastOpen,
    onOpen: onBroadcastOpen,
    onClose: onBroadcastBroadcastClose,
  } = useDisclosure();

  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();

  const isViewerSeller =
    isLoggedIn && user?.username === listing?.seller?.username;

  const viewerId = user?._id;
  const buyerId =
    listing?.buyer && typeof listing.buyer === "object"
      ? listing.buyer._id
      : listing?.buyer;
  const viewerIsBuyer =
    isLoggedIn && buyerId && viewerId && String(buyerId) === String(viewerId);

  const isListingDeleted = !!listing?.isDeleted;
  const isListingSold = !!listing?.isSold;

  const showUnavailableBanner =
    !!listing &&
    (isListingDeleted || isListingSold) &&
    !isViewerSeller &&
    !viewerIsBuyer;

  const showBuyerSoldBanner = !!listing && isListingSold && viewerIsBuyer;
  const showSellerSoldBanner = !!listing && isListingSold && isViewerSeller;

  const disableBuyerActions = showUnavailableBanner || showBuyerSoldBanner;

  const getStarColorForRating = (star, rating) => {
    if (!rating || star > rating) return "gray.300";
    if (rating === 1) return "red.400";
    if (rating === 2) return "orange.400";
    return "green.400";
  };

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch {
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

  useEffect(() => {
    const fetchActiveOffer = async () => {
      if (
        !token ||
        !isLoggedIn ||
        !listing ||
        isViewerSeller ||
        disableBuyerActions
      ) {
        setActiveSellerOffer(null);
        return;
      }

      try {
        const res = await fetch(
          `/api/offers/active-seller-offer/${listing._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setActiveSellerOffer(null);
          return;
        }

        const data = await res.json();
        setActiveSellerOffer(data.offer || null);
      } catch {
        setActiveSellerOffer(null);
      }
    };

    fetchActiveOffer();
  }, [token, isLoggedIn, listing, isViewerSeller, disableBuyerActions]);

  const offerExpiresAt = activeSellerOffer?.expiresAt;

  useEffect(() => {
    if (!offerExpiresAt) {
      setTimeLeft(null);
      return;
    }

    const expiresAtMs = new Date(offerExpiresAt).getTime();

    const update = () => {
      const diff = expiresAtMs - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [offerExpiresAt]);

  useFetchFavorites();

  const [localFavoriteIds, setLocalFavoriteIds] = useState(() => {
    return Array.isArray(favorites)
      ? favorites.map((f) => (f && typeof f === "object" ? f._id : f))
      : [];
  });

  const debounceTimers = useRef({});

  const handleFavorite = (listingId) => {
    if (!isLoggedIn) return onOpenAuthModal("register");

    const isFavorited = localFavoriteIds.includes(listingId);

    setLocalFavoriteIds((prev) =>
      isFavorited ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );

    setListing((prev) =>
      prev && prev._id === listingId
        ? {
            ...prev,
            favoritesCount: Math.max(
              0,
              prev.favoritesCount + (isFavorited ? -1 : 1)
            ),
          }
        : prev
    );

    if (debounceTimers.current[listingId]) {
      clearTimeout(debounceTimers.current[listingId]);
    }

    debounceTimers.current[listingId] = setTimeout(async () => {
      try {
        const data = await toggleFavorite(listingId, token, isFavorited);
        setFetchedData({ favorites: data.favorites });

        const updated = data.favorites.find((f) => f._id === listingId);
        if (updated) {
          setListing((prev) =>
            prev && prev._id === listingId
              ? { ...prev, favoritesCount: updated.favoritesCount }
              : prev
          );
        }
      } catch (err) {
        setLocalFavoriteIds((prev) =>
          isFavorited
            ? [...prev, listingId]
            : prev.filter((id) => id !== listingId)
        );

        setListing((prev) =>
          prev && prev._id === listingId
            ? {
                ...prev,
                favoritesCount: Math.max(
                  0,
                  prev.favoritesCount + (isFavorited ? 1 : -1)
                ),
              }
            : prev
        );

        console.error("Failed to toggle favorite:", err);
      }
    }, 400);
  };

  useEffect(() => {
    if (!isLoggedIn || !token || !listing || !viewerIsBuyer) return;

    const fetchReviewForListing = async () => {
      try {
        setReviewLoading(true);
        const res = await fetch(`/api/feedback/listing/${listing._id}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setListingOrderId(null);
          setReview(null);
          return;
        }

        const data = await res.json();
        setListingOrderId(data.orderId || null);
        setReview(data.review || null);
      } catch (err) {
        console.error("Failed to fetch listing review", err);
        setListingOrderId(null);
        setReview(null);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviewForListing();
  }, [isLoggedIn, token, listing, viewerIsBuyer]);

  const rotateNext = () => {
    if (listing.images.length > 1) {
      setActiveIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const rotatePrev = () => {
    if (listing.images.length > 1) {
      setActiveIndex(
        (prev) => (prev - 1 + listing.images.length) % listing.images.length
      );
    }
  };

  const openImageModal = () => setIsImageOpen(true);
  const closeImageModal = () => setIsImageOpen(false);

  const getTimestamp = (createdAt) => {
    const createdAtMS = new Date(createdAt).getTime();
    const now = Date.now();
    const ms = now - createdAtMS;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const getPercentOff = (original, sale) => {
    if (!original || !sale || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const formatOfferCountdown = (ms) => {
    if (ms == null) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const basePrice = listing?.price || 0;
  const sellerOfferPrice =
    activeSellerOffer && !disableBuyerActions
      ? activeSellerOffer.amount_cents / 100
      : null;
  const displayPrice = sellerOfferPrice ?? basePrice;

  const bannerText = isListingDeleted
    ? "This listing has been removed"
    : "This listing has sold";

  const bannerRating = review?.rating || 0;

  const handleOpenReview = () => {
    if (!isLoggedIn) return onOpenAuthModal("register");
    if (!listingOrderId) return;
    onReviewOpen();
  };

  const handleSubmitReview = async (payload) => {
    if (!listingOrderId) {
      throw new Error("Order not found for this listing");
    }

    const url = review
      ? `/api/feedback/${review._id}`
      : `/api/feedback/${listingOrderId}`;
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

  return (
    <>
      {isLoading && <ListingSkeleton />}

      {!isLoading && listing && (
        <Container>
          {showUnavailableBanner && (
            <Box
              w="100%"
              bg="gray.100"
              borderBottom="1px solid"
              borderColor="gray.200"
              py={3}
              textAlign="center"
              mb={4}
              mt={10}
            >
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {bannerText}
              </Text>
            </Box>
          )}

          {!showUnavailableBanner && showBuyerSoldBanner && (
            <>
              <Box
                w="100%"
                bg="gray.100"
                borderBottom="1px solid"
                borderColor="gray.200"
                py={3}
                textAlign="center"
                mb={0}
                mt={10}
              >
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  This listing has sold
                </Text>
              </Box>
              <Box w="100%" py={3} px={6} mt={4} mb={6}>
                <Flex align="center" justify="space-between">
                  <HStack spacing={3}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                      Leave feedback on this listing
                    </Text>
                    <HStack spacing={1}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          boxSize={3.5}
                          color={getStarColorForRating(star, bannerRating)}
                        />
                      ))}
                    </HStack>
                  </HStack>
                  <Button
                    size="sm"
                    variant="outline"
                    borderRadius="none"
                    colorScheme="blackAlpha"
                    isDisabled={reviewLoading || !listingOrderId}
                    onClick={handleOpenReview}
                  >
                    {review ? "Edit Feedback" : "Leave Feedback"}
                  </Button>
                </Flex>
              </Box>
            </>
          )}

          {!showUnavailableBanner && showSellerSoldBanner && (
            <Box
              w="100%"
              bg="gray.100"
              borderBottom="1px solid"
              borderColor="gray.200"
              py={3}
              textAlign="center"
              mb={4}
              mt={10}
            >
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                This listing has sold
              </Text>
            </Box>
          )}

          <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={10}>
            <GridItem colSpan={[12, null, 8]}>
              <Grid templateColumns="repeat(8, 1fr)" gap={2}>
                <GridItem colSpan={1}>
                  <Box
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button variant="ghost" fontSize="2xl" onClick={rotatePrev}>
                      ‹
                    </Button>
                  </Box>
                </GridItem>

                <GridItem colSpan={6}>
                  {listing?.images?.length > 0 ? (
                    <Img
                      src={listing?.images[activeIndex]}
                      style={{
                        width: "100%",
                        height: "600px",
                        objectFit: "cover",
                        objectPosition: "center center",
                        cursor: "zoom-in",
                        opacity: showUnavailableBanner ? 0.35 : 1,
                        transition: "opacity 0.2s",
                      }}
                      onClick={openImageModal}
                    />
                  ) : (
                    <Box
                      bg="gray.100"
                      w="100%"
                      h="600px"
                      opacity={showUnavailableBanner ? 0.35 : 1}
                    />
                  )}
                </GridItem>

                <GridItem colSpan={1}>
                  <Box
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button variant="ghost" fontSize="2xl" onClick={rotateNext}>
                      ›
                    </Button>
                  </Box>
                </GridItem>
              </Grid>

              <Grid templateColumns="repeat(8, 1fr)" gap={2} mt={2}>
                {listing?.images?.length > 0
                  ? listing.images.map((img, i) => (
                      <GridItem colSpan={1} key={i}>
                        <Img
                          src={img}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            objectPosition: "center center",
                            opacity:
                              i === activeIndex && !showUnavailableBanner
                                ? 1
                                : showUnavailableBanner
                                ? 0.3
                                : 0.4,
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveIndex(i)}
                        />
                      </GridItem>
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <GridItem colSpan={1} key={i}>
                        <Box
                          bg="gray.200"
                          h="80px"
                          opacity={showUnavailableBanner ? 0.35 : 1}
                        />
                      </GridItem>
                    ))}
              </Grid>
            </GridItem>

            <GridItem colSpan={[12, null, 4]}>
              <VStack align="start" spacing={8}>
                <HStack spacing={4} justify="space-between" w="100%">
                  <VStack align="start">
                    <Heading size="md">{listing?.designer}</Heading>
                    <Text fontSize="sm">{listing?.title}</Text>
                  </VStack>
                  <VStack align="center">
                    <IconButton
                      p={1}
                      icon={
                        localFavoriteIds.includes(listing?._id) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )
                      }
                      onClick={() => {
                        if (!isLoggedIn) return onOpenAuthModal("register");
                        handleFavorite(listing._id);
                      }}
                    />
                    <Text fontSize="xs">{listing?.favoritesCount}</Text>
                  </VStack>
                </HStack>

                <VStack align="start">
                  <Text fontSize="sm">
                    <Box as="span" fontWeight="semibold">
                      Size{" "}
                    </Box>
                    {listing?.department === "Menswear" ? "Men's" : "Women's"} /{" "}
                    {listing?.size}
                  </Text>
                  <Text fontSize="sm">
                    <Box as="span" fontWeight="semibold">
                      Color{" "}
                    </Box>
                    {listing?.color}
                  </Text>
                  <Text fontSize="sm">
                    <Box as="span" fontWeight="semibold">
                      Condition{" "}
                    </Box>
                    {listing?.condition}
                  </Text>
                </VStack>

                <Box>
                  {sellerOfferPrice ? (
                    <>
                      <HStack spacing={3} align="baseline">
                        <Text
                          fontSize="2xl"
                          fontWeight="semibold"
                          color="gray.400"
                          sx={{
                            textDecoration: "line-through",
                            textDecorationThickness: "2px",
                          }}
                        >
                          ${basePrice.toLocaleString()}
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="green.500"
                        >
                          ${displayPrice.toLocaleString()}
                        </Text>
                      </HStack>
                      <Text
                        fontSize="xs"
                        color="green.600"
                        fontWeight="semibold"
                        mt={1}
                      >
                        You received an offer
                        {timeLeft !== null && (
                          <> · Expires in {formatOfferCountdown(timeLeft)}</>
                        )}
                      </Text>
                    </>
                  ) : (
                    <HStack spacing={2}>
                      <Text fontSize="2xl" fontWeight="bold">
                        ${displayPrice.toLocaleString()}
                      </Text>

                      {listing?.originalPrice && listing?.price && (
                        <Text
                          fontSize="2xl"
                          fontWeight="semibold"
                          color="gray.400"
                          sx={{
                            textDecoration: "line-through",
                            textDecorationThickness: "2px",
                          }}
                        >
                          ${listing?.originalPrice?.toLocaleString()}
                        </Text>
                      )}

                      {listing?.originalPrice && listing?.price && (
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          {getPercentOff(listing.originalPrice, listing.price)}%
                          off
                        </Text>
                      )}
                    </HStack>
                  )}

                  <Text fontSize="sm">+ $9 Shipping — US to United States</Text>
                </Box>

                {!isViewerSeller && !disableBuyerActions && (
                  <KlarnaAffirmButton
                    onOpen={onKlarnaOpen}
                    price={displayPrice}
                  />
                )}

                {!isViewerSeller ? (
                  <VStack w="100%" spacing={2}>
                    {showBuyerSoldBanner ? (
                      <HStack w="100%">
                        <Button
                          borderRadius="none"
                          colorScheme="blackAlpha"
                          flex="1"
                          onClick={() => {
                            if (!isLoggedIn) return onOpenAuthModal("register");
                          }}
                        >
                          Resell
                        </Button>
                      </HStack>
                    ) : (
                      !showUnavailableBanner && (
                        <>
                          <HStack w="100%">
                            <Button
                              borderRadius="none"
                              colorScheme="blackAlpha"
                              flex="1"
                              onClick={() => {
                                if (!isLoggedIn)
                                  return onOpenAuthModal("register");
                                navigate(`/checkout/${listing._id}`);
                              }}
                            >
                              Purchase
                            </Button>
                          </HStack>

                          <HStack w="100%">
                            {listing.canOffer && (
                              <Button
                                borderRadius="none"
                                variant="outline"
                                flex="1"
                                onClick={() => {
                                  if (!isLoggedIn)
                                    return onOpenAuthModal("register");
                                  onOfferOpen();
                                }}
                              >
                                Offer
                              </Button>
                            )}
                            <Button
                              borderRadius="none"
                              variant="outline"
                              flex="1"
                              onClick={() => {
                                if (!isLoggedIn)
                                  return onOpenAuthModal("register");
                                onMessageOpen();
                              }}
                            >
                              Message
                            </Button>
                          </HStack>
                        </>
                      )
                    )}
                  </VStack>
                ) : (
                  <VStack w="100%" spacing={2}>
                    {showSellerSoldBanner ? (
                      <>
                        <Button w="100%" variant="outline" borderRadius="none">
                          Issue Refund
                        </Button>
                        <Button w="100%" variant="outline" borderRadius="none">
                          Duplicate Listing
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button w="100%" colorScheme="blackAlpha">
                          Drop Price
                        </Button>
                        <Button
                          w="100%"
                          variant="outline"
                          onClick={() => navigate(`/sell/edit/${listing._id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          w="100%"
                          variant="outline"
                          onClick={onBroadcastOpen}
                        >
                          Send Offer
                        </Button>
                        <Button w="100%" variant="outline">
                          Delete
                        </Button>
                      </>
                    )}
                  </VStack>
                )}

                <HStack spacing={4} align="center" w="100%">
                  <Avatar
                    name={listing?.seller?.username || "fakeuser"}
                    size="sm"
                    bg="gray.200"
                    color="black"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      {listing?.seller?.username || "fakeuser"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      4 items for sale
                    </Text>
                  </Box>
                  {!isViewerSeller && (
                    <Button
                      fontWeight="bold"
                      size="sm"
                      fontSize="xs"
                      ml="auto"
                      variant="outline"
                      onClick={() => {
                        if (!isLoggedIn) return onOpenAuthModal("register");
                      }}
                    >
                      Follow
                    </Button>
                  )}
                </HStack>

                <Divider />

                {listing?.description && (
                  <Box>
                    <Heading size="xs" mb={2}>
                      Seller description
                    </Heading>
                    <Text fontSize="sm" mb={1} whiteSpace="pre-line">
                      {listing.description}
                    </Text>
                  </Box>
                )}

                {listing?.tags?.length > 0 && (
                  <Box>
                    <Heading size="xs" mb={2}>
                      Tags
                    </Heading>
                    <HStack spacing={2} wrap="wrap">
                      {listing.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}

                <Divider />

                <VStack align="start" spacing={4}>
                  {listing?.authenticated && (
                    <Flex align="center" gap={2}>
                      <Text fontWeight="bold" fontSize="sm">
                        Authenticated
                      </Text>
                      <Box
                        as="svg"
                        width="5"
                        height="5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="gray.500"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 
       11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 
       5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c
       -3.196 0-6.1-1.248-8.25-3.285Z"
                        />
                      </Box>
                    </Flex>
                  )}

                  <Box>
                    <Text fontSize="xs" color="gray.400">
                      Posted to I Need It{" "}
                      <Box as="span" color="gray.500">
                        {listing?.createdAt
                          ? getTimestamp(listing.createdAt)
                          : ""}
                      </Box>
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Listing ID{" "}
                      <Box as="span" color="gray.500">
                        {listing?._id || "01234567"}
                      </Box>
                    </Text>
                  </Box>

                  {!isViewerSeller && (
                    <Button
                      variant="outline"
                      size="sm"
                      fontWeight="bold"
                      fontSize="xs"
                      leftIcon={<WarningIcon boxSize={3.5} />}
                      onClick={() => {
                        if (!isLoggedIn) return onOpenAuthModal("register");
                      }}
                    >
                      Report Listing
                    </Button>
                  )}
                </VStack>

                {!isViewerSeller && <Divider />}

                {!isViewerSeller && <PurchaseProtection />}
              </VStack>
            </GridItem>
          </Grid>
        </Container>
      )}

      <OfferModal
        isOpen={isOfferOpen}
        onClose={onOfferClose}
        listing={listing}
        mode="listing"
      />
      <MessageModal
        isOpen={isMessageOpen}
        onClose={onMessageClose}
        listingId={listing?._id}
      />
      <BroadcastOfferModal
        isOpen={isBroadcastOpen}
        onClose={onBroadcastBroadcastClose}
        listing={listing}
      />

      {listing?.price && (
        <KlarnaAffirmModal
          isOpen={isKlarnaOpen}
          onClose={onKlarnaClose}
          price={displayPrice}
        />
      )}

      {isImageOpen && listing && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.85)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          onClick={closeImageModal}
        >
          <Button
            position="absolute"
            left="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={10000}
            onClick={(e) => {
              e.stopPropagation();
              rotatePrev();
            }}
            variant="ghost"
            fontSize="3xl"
            color="white"
            _hover={{ bg: "transparent", opacity: 0.7 }}
          >
            ‹
          </Button>

          <Box
            onClick={(e) => e.stopPropagation()}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Img
              src={listing.images[activeIndex]}
              maxW="90vw"
              maxH="90vh"
              objectFit="contain"
            />
          </Box>

          <Button
            position="absolute"
            right="20px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={10000}
            onClick={(e) => {
              e.stopPropagation();
              rotateNext();
            }}
            variant="ghost"
            fontSize="3xl"
            color="white"
            _hover={{ bg: "transparent", opacity: 0.7 }}
          >
            ›
          </Button>
        </Box>
      )}

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
    </>
  );
}
