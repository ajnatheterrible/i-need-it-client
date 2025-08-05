import {
  Box,
  Text,
  Select,
  HStack,
  Grid,
  Image,
  Badge,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

import FavoritesSkeleton from "../components/skeletons/FavoritesSkeleton";

import useFetchFavorites from "../hooks/useFetchFavorites";
import useAuthStore from "../store/authStore";
import getTimestamp from "../utils/getTimestamp";
import { toggleFavorite } from "../utils/favoriteUtils";

export default function UserFavorites() {
  const { loading } = useFetchFavorites();
  const [sortOption, setSortOption] = useState("default");
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
  }, [fetchedFavorites]);

  const sortedFavorites = useMemo(() => {
    if (!initialFavorites) return [];

    return [...initialFavorites].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "recent")
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
      <Box position="sticky" top="70px" bg="white" zIndex={10} py={6}>
        <HStack justify="space-between" align="center">
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 0.25 }}
            visibility={loading ? "hidden" : "visible"}
          >
            <Text fontWeight="semibold">
              {sortedFavorites.length} favorited item
              {sortedFavorites.length !== 1 && "s"}
            </Text>
          </Box>
          <Select
            size="sm"
            w="auto"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Sort by: Default</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="recent">Most Recent</option>
          </Select>
        </HStack>
      </Box>

      <Box mt={3}>
        {loading ? (
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {[...Array(3)].map((_, i) => (
              <FavoritesSkeleton key={i} />
            ))}
          </Grid>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {sortedFavorites.length === 0 ? (
              <Text fontSize="sm" textAlign="center" color="gray.500" mt={10}>
                You haven’t favorited anything yet
              </Text>
            ) : (
              <Grid templateColumns="repeat(5, 1fr)" gap={6}>
                {sortedFavorites.map((item) => (
                  <Box key={item._id} overflow="hidden">
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
                ))}
              </Grid>
            )}
          </motion.div>
        )}
      </Box>
    </>
  );
}
