import {
  Box,
  Heading,
  Text,
  Select,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  Badge,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import FavoritesSkeleton from "../components/skeletons/FavoritesSkeleton";

import useFetchFavorites from "../hooks/useFetchFavorites";
import useAuthStore from "../store/authStore";
import getTimestamp from "../utils/getTimestamp";
import { toggleFavorite } from "../utils/favoriteUtils";

export default function Favorites() {
  const { loading } = useFetchFavorites();
  const [sortOption, setSortOption] = useState("date");
  const toast = useToast();

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const fetchedFavorites = useAuthStore((s) => s.fetchedData.favorites);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const [initialFavorites, setInitialFavorites] = useState([]);
  const [localFavoriteIds, setLocalFavoriteIds] = useState([]);
  const debounceTimers = useRef({});

  useEffect(() => {
    if (
      Array.isArray(fetchedFavorites) &&
      fetchedFavorites.length > 0 &&
      initialFavorites.length === 0
    ) {
      setInitialFavorites(fetchedFavorites);
      const ids = fetchedFavorites.map((f) =>
        f && typeof f === "object" ? f._id : f
      );
      setLocalFavoriteIds(ids);
    }
  }, [fetchedFavorites, initialFavorites.length]);

  const sortedFavorites = useMemo(() => {
    if (!initialFavorites) return [];

    return [...initialFavorites].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [initialFavorites, sortOption]);

  const handleToggleFavorite = (listingId) => {
    if (!isLoggedIn) return;

    const isCurrentlyFavorited = localFavoriteIds.includes(listingId);

    setLocalFavoriteIds((prev) =>
      isCurrentlyFavorited
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId]
    );

    if (debounceTimers.current[listingId]) {
      clearTimeout(debounceTimers.current[listingId]);
    }

    debounceTimers.current[listingId] = setTimeout(async () => {
      try {
        const data = await toggleFavorite(
          listingId,
          token,
          isCurrentlyFavorited
        );
        setFetchedData({ favorites: data.favorites });
      } catch (err) {
        setLocalFavoriteIds((prev) =>
          isCurrentlyFavorited
            ? [...prev, listingId]
            : prev.filter((id) => id !== listingId)
        );

        toast({
          title: "Error",
          description: "Failed to update favorite. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }, 400);
  };

  return (
    <>
      <Container>
        <Box py={10}>
          <VStack spacing={6} align="center" mb={6}>
            <Heading size="lg">Favorites</Heading>
            <Text fontSize="sm">
              You’ll be notified when your favorite listings drop in price or
              are relisted
            </Text>
          </VStack>

          <HStack justify="center" spacing={4}>
            <Text fontWeight="semibold">Sort by</Text>
            <Select
              maxW="160px"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">date added</option>
              <option value="price_low_high">price: low to high</option>
              <option value="price_high_low">price: high to low</option>
            </Select>
          </HStack>

          <SimpleGrid
            columns={{ base: 2, md: 3, lg: 5 }}
            spacingY={10}
            spacingX={6}
            mt={16}
          >
            {loading ? (
              [...Array(3)].map((_, i) => <FavoritesSkeleton key={i} />)
            ) : sortedFavorites.length === 0 ? (
              <Box
                as={motion.div}
                gridColumn="1 / -1"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="25vh"
                width="100%"
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <Text fontSize="sm" color="gray.500">
                  You haven’t favorited anything yet
                </Text>
              </Box>
            ) : (
              <AnimatePresence>
                {sortedFavorites.map((item) => {
                  const isListingArchived = item.isSold || item.isDeleted;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box overflow="hidden">
                        <Box
                          as={RouterLink}
                          to={`/listing/${item._id}`}
                          _hover={{ textDecoration: "none" }}
                        >
                          <Box position="relative" height="200px">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              height="100%"
                              width="100%"
                              objectFit="cover"
                              opacity={isListingArchived ? 0.35 : 1}
                            />
                            {item.isFreeShipping && (
                              <Badge
                                position="absolute"
                                top="16px"
                                left="8px"
                                bg="#DCEF31"
                                color="black"
                                fontWeight="bold"
                                fontSize="0.7em"
                                px={2}
                                py={1}
                                borderRadius="sm"
                              >
                                FREE SHIPPING
                              </Badge>
                            )}
                          </Box>

                          <Box p={3} pt={3} pb={0}>
                            <Text fontSize="xs" color="gray.500">
                              {getTimestamp(item.createdAt)}
                            </Text>

                            <Box
                              borderBottom="1px solid"
                              borderColor="gray.200"
                              my={2}
                            />
                          </Box>
                        </Box>

                        <Box px={3} pb={3}>
                          <HStack justify="space-between" mt={1}>
                            <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                              {item.designer}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {item.size}
                            </Text>
                          </HStack>

                          <Text fontSize="xs" color="gray.600" noOfLines={1}>
                            {item.title}
                          </Text>

                          <HStack justify="space-between" mt={4}>
                            <Text fontSize="sm" fontWeight="bold">
                              ${item?.price?.toLocaleString()}
                            </Text>

                            <IconButton
                              size="sm"
                              icon={
                                localFavoriteIds.includes(item._id) ? (
                                  <FaHeart color="black" />
                                ) : (
                                  <FaRegHeart />
                                )
                              }
                              aria-label={
                                localFavoriteIds.includes(item._id)
                                  ? "Unfavorite"
                                  : "Favorite"
                              }
                              onClick={() => handleToggleFavorite(item._id)}
                            />
                          </HStack>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}
