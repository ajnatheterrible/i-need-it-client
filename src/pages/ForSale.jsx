import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Image,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";
import ForSaleSkeleton from "../components/skeletons/ForSaleSkeleton";
import BroadcastOfferModal from "../components/modals/BroadcastOfferModal";
import PriceDropModal from "../components/modals/PriceDropModal";

import useAuthStore from "../store/authStore";
import useFetchForSale from "../hooks/useFetchForSale";
import getTimestamp from "../utils/getTimestamp";

export default function ForSale() {
  const { loading } = useFetchForSale();
  const token = useAuthStore((s) => s.token);
  const forSale = useAuthStore((s) => s.fetchedData?.forSale);

  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();
  const {
    isOpen: isPriceOpen,
    onOpen: onPriceOpen,
    onClose: onPriceClose,
  } = useDisclosure();

  const [selectedListingForOffer, setSelectedListingForOffer] = useState(null);
  const [selectedListingForPriceDrop, setSelectedListingForPriceDrop] =
    useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(forSale)) {
      setItems(forSale);
    } else {
      setItems([]);
    }
  }, [forSale]);

  const openOfferModal = (listing) => {
    setSelectedListingForOffer(listing);
    onOfferOpen();
  };

  const openPriceDropModal = (listing) => {
    setSelectedListingForPriceDrop(listing);
    onPriceOpen();
  };

  const handlePriceDropSubmit = async ({ newPrice, discountPercent }) => {
    if (!selectedListingForPriceDrop || !token) {
      return { success: false, error: "Missing data" };
    }

    const res = await fetch("/api/orders/price-drop", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: selectedListingForPriceDrop._id,
        newPrice,
        discountPercent,
      }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || "Failed to update price",
      };
    }

    const updatedListing = data?.listing;
    if (updatedListing && updatedListing._id) {
      setItems((prev) =>
        prev.map((l) =>
          l._id === updatedListing._id ? { ...l, ...updatedListing } : l
        )
      );
    }

    return { success: true };
  };

  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid templateColumns="repeat(12, 1fr)" gap={6} pt={6} w="full">
            <GridItem colSpan={2}>
              <SellerSidebar />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                  For sale
                </Text>

                {loading ? (
                  <ForSaleSkeleton />
                ) : !items.length ? (
                  <Box
                    as={motion.div}
                    w="full"
                    textAlign="center"
                    mt={10}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Text fontSize="sm" color="gray.500">
                      You haven’t listed anything for sale yet
                    </Text>
                  </Box>
                ) : (
                  <SimpleGrid
                    as={motion.div}
                    columns={[1, 2, 3]}
                    spacing={6}
                    w="full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {items.map((item) => (
                      <Box key={item._id} overflow="hidden" mb={6}>
                        <HStack align="start" spacing={0}>
                          <Box
                            as={RouterLink}
                            to={`/listing/${item._id}`}
                            position="relative"
                            height="150px"
                            w="110px"
                            bg="gray.100"
                            flexShrink={0}
                          >
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              height="100%"
                              width="100%"
                              objectFit="cover"
                            />
                          </Box>

                          <Box p={3} flex="1">
                            <Text fontSize="xs" color="gray.500">
                              {getTimestamp(item.createdAt)}
                            </Text>

                            <Box
                              display="flex"
                              justifyContent="space-between"
                              mt={1}
                            >
                              <Text
                                fontWeight="bold"
                                fontSize="sm"
                                noOfLines={1}
                              >
                                {item.designer}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {item.size}
                              </Text>
                            </Box>

                            <Text fontSize="xs" color="gray.600" noOfLines={1}>
                              {item.title}
                            </Text>

                            <HStack
                              justify="space-between"
                              align="baseline"
                              w="full"
                            >
                              <Text fontSize="sm" fontWeight="bold" mt={6}>
                                ${item.price?.toLocaleString()}
                              </Text>
                              <HStack spacing={1}>
                                <Text fontSize="xs" fontWeight="semibold">
                                  {item.favoritesCount}
                                </Text>
                                <Icon as={FaRegHeart} boxSize={2.5} />
                              </HStack>
                            </HStack>
                          </Box>
                        </HStack>

                        <HStack spacing={2} mt={4} align="start">
                          <Button
                            size="sm"
                            variant="outline"
                            borderRadius="none"
                            fontSize="xs"
                            w="100%"
                            onClick={() => openPriceDropModal(item)}
                          >
                            Price Drop
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            borderRadius="none"
                            fontSize="xs"
                            w="100%"
                          >
                            Bump
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            borderRadius="none"
                            fontSize="xs"
                            w="100%"
                            onClick={() => openOfferModal(item)}
                          >
                            Send Offer
                          </Button>
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>

      {selectedListingForOffer && (
        <BroadcastOfferModal
          isOpen={isOfferOpen}
          onClose={onOfferClose}
          listing={selectedListingForOffer}
        />
      )}

      {selectedListingForPriceDrop && (
        <PriceDropModal
          isOpen={isPriceOpen}
          onClose={() => {
            onPriceClose();
            setSelectedListingForPriceDrop(null);
          }}
          listing={selectedListingForPriceDrop}
          currentPrice={selectedListingForPriceDrop.price}
          onSubmit={handlePriceDropSubmit}
        />
      )}
    </>
  );
}
