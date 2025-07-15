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
import { WarningIcon } from "@chakra-ui/icons";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useEffect, useState, useMemo } from "react";
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
import ListingSkeleton from "../components/skeletons/ListingSkeleton";

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

  const isViewerSeller =
    isLoggedIn && user?.username === listing?.seller?.username;

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
  }, [id]);

  useFetchFavorites();

  const favoriteIds = useMemo(() => {
    if (!Array.isArray(favorites)) return [];

    return favorites.map((f) => (f && typeof f === "object" ? f._id : f));
  }, [favorites]);

  const handleFavorite = async (listingId) => {
    if (!isLoggedIn) return onOpenAuthModal("register");

    const isFavorited = favoriteIds.includes(listingId);

    try {
      const data = await toggleFavorite(listingId, token, isFavorited);
      setFetchedData({ favorites: [...data.favorites] });

      const updated = data.favorites.find((f) => f._id === listingId);

      if (updated) {
        setListing(updated);
      } else {
        setListing((prev) => ({
          ...prev,
          favoritesCount: Math.max(0, (prev.favoritesCount || 1) - 1),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleGuestAction = () => onOpenAuthModal("register");

  return (
    <>
      {!isLoading && listing && (
        <Container>
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
                      }}
                      onClick={openImageModal}
                    />
                  ) : (
                    <Box bg="gray.100" w="100%" h="600px" />
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
                            opacity: i === activeIndex ? 1 : 0.4,
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveIndex(i)}
                        />
                      </GridItem>
                    ))
                  : Array.from({ length: 5 }).map((_, i) => (
                      <GridItem colSpan={1} key={i}>
                        <Box bg="gray.200" h="80px" />
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
                        favoriteIds.includes(listing?._id) ? (
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
                  <HStack spacing={2}>
                    <Text fontSize="2xl" fontWeight="bold">
                      ${listing?.price?.toLocaleString()}
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
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {getPercentOff(listing.originalPrice, listing.price)}%
                        off
                      </Text>
                    )}
                  </HStack>

                  <Text fontSize="sm">+ $9 Shipping — US to United States</Text>
                </Box>

                {!isViewerSeller && (
                  <KlarnaAffirmButton
                    onOpen={onKlarnaOpen}
                    price={listing.price}
                  />
                )}

                {!isViewerSeller ? (
                  <VStack w="100%" spacing={2}>
                    <HStack w="100%">
                      <Button
                        colorScheme="blackAlpha"
                        flex="1"
                        onClick={() => {
                          if (!isLoggedIn) return onOpenAuthModal("register");
                          navigate("/checkout");
                        }}
                      >
                        PURCHASE
                      </Button>
                    </HStack>

                    <HStack w="100%">
                      {listing.canOffer && (
                        <Button
                          variant="outline"
                          flex="1"
                          onClick={() => {
                            if (!isLoggedIn) return onOpenAuthModal("register");
                            onOfferOpen();
                          }}
                        >
                          OFFER
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        flex="1"
                        onClick={() => {
                          if (!isLoggedIn) return onOpenAuthModal("register");
                          onMessageOpen();
                        }}
                      >
                        MESSAGE
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack w="100%" spacing={2}>
                    <Button w="100%" colorScheme="blackAlpha">
                      DROP PRICE
                    </Button>
                    <Button
                      w="100%"
                      variant="outline"
                      onClick={() => navigate(`/sell/edit/${listing._id}`)}
                    >
                      EDIT
                    </Button>
                    <Button w="100%" variant="outline">
                      SEND OFFER
                    </Button>
                    <Button w="100%" variant="outline">
                      DELETE
                    </Button>
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
                      FOLLOW
                    </Button>
                  )}
                </HStack>

                <Divider />

                {listing?.description && (
                  <Box>
                    <Heading size="xs" mb={2}>
                      Seller Description
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
                      textTransform="uppercase"
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

      <OfferModal isOpen={isOfferOpen} onClose={onOfferClose} />
      <MessageModal isOpen={isMessageOpen} onClose={onMessageClose} />

      {listing?.price && (
        <KlarnaAffirmModal
          isOpen={isKlarnaOpen}
          onClose={onKlarnaClose}
          price={listing.price}
        />
      )}

      {isImageOpen && (
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
      <Footer />
    </>
  );
}
