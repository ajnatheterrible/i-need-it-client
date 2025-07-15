import {
  Box,
  Text,
  Select,
  HStack,
  Grid,
  Image,
  Badge,
  Flex,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

import { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import FavoritesSkeleton from "../components/skeletons/FavoritesSkeleton";

import useFetchFavorites from "../hooks/useFetchFavorites";
import useAuthStore from "../store/authStore";
import getTimestamp from "../utils/getTimestamp";
import { toggleFavorite } from "../utils/favoriteUtils";

export default function UserFavorites() {
  const [hasFetchedFavorites, setHasFetchedFavorites] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const toast = useToast();

  useFetchFavorites(hasFetchedFavorites, setHasFetchedFavorites);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const favorites = useAuthStore((s) => s.fetchedData.favorites);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const sortedFavorites = useMemo(() => {
    if (!favorites) return [];

    return [...favorites].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "recent")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [favorites, sortOption]);

  const handleUnfavorite = async (listingId) => {
    if (!isLoggedIn) return;

    try {
      const data = await toggleFavorite(listingId, token, true);

      setFetchedData({ favorites: data.favorites });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box position="sticky" top="70px" bg="white" zIndex={10} py={6}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">
            {sortedFavorites.length} favorited item
            {sortedFavorites.length !== 1 && "s"}
          </Text>
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
        </Flex>
      </Box>

      <Box mt={3}>
        {sortedFavorites.length === 0 ? (
          <Text fontSize="sm" textAlign="center" color="gray.500" mt={10}>
            You haven’t favorited anything yet
          </Text>
        ) : (
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {!hasFetchedFavorites ? (
              <FavoritesSkeleton />
            ) : (
              sortedFavorites.map((item) => (
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
                        icon={<FaHeart color="black" />}
                        aria-label="Unfavorite"
                        onClick={() => handleUnfavorite(item._id)}
                      />
                    </HStack>
                  </Box>
                </Box>
              ))
            )}
          </Grid>
        )}
      </Box>
    </>
  );
}
