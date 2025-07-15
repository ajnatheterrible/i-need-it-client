import { useMemo, useState } from "react";

import {
  Box,
  Heading,
  Text,
  Select,
  HStack,
  Image,
  Badge,
  IconButton,
  Button,
  Grid,
  Flex,
} from "@chakra-ui/react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import FilterSidebar from "../components/sidebars/FilterSidebar";
import SearchResultsSkeleton from "../components/skeletons/SearchResultsSkeleton";

import getTimestamp from "../utils/getTimestamp";
import useFetchListings from "../hooks/useFetchListings";
import useSyncSearchParams from "../hooks/useSyncSearchParams";
import useFetchFavorites from "../hooks/useFetchFavorites";
import useFetchSizes from "../hooks/useFetchSizes";
import { toggleFavorite } from "../utils/favoriteUtils";
import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

export default function SearchResults() {
  const onOpenAuthModal = useAuthModal();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const userId = useAuthStore((s) => s.user?._id);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const fetchedData = useAuthStore((s) => s.fetchedData);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  useFetchFavorites();
  useFetchSizes();

  const [isLoading, setIsLoading] = useState(false);

  const [listings, setListings] = useState([]);
  const [count, setCount] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [isUsingMySizes, setIsUsingMySizes] = useState(false);
  const [filters, setFilters] = useState({
    department: searchParams.get("department")?.split(",") || [],
    category: searchParams.get("category")?.split(",") || [],
    size: searchParams.get("size")?.split(",") || [],
    condition: searchParams.get("condition")?.split(",") || [],
    priceMin: searchParams.get("priceMin") || null,
    priceMax: searchParams.get("priceMax") || null,
  });

  const favoriteIds = useMemo(() => {
    const favorites = fetchedData?.favorites;
    if (!Array.isArray(favorites)) return [];

    return favorites.map((f) => (f && typeof f === "object" ? f._id : f));
  }, [fetchedData?.favorites]);

  useSyncSearchParams(
    filters,
    query,
    isUsingMySizes,
    setFilters,
    setIsUsingMySizes
  );
  useFetchListings(searchParams, query, setListings, setCount, setIsLoading);

  const handleClearAll = () => {
    setFilters({
      department: [],
      category: [],
      size: [],
      condition: [],
      priceMin: null,
      priceMax: null,
    });
  };

  const sortedListings = [...listings];
  if (sortOption === "price_low_high") {
    sortedListings.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price_high_low") {
    sortedListings.sort((a, b) => b.price - a.price);
  } else if (sortOption === "recent") {
    sortedListings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const handleFavorite = async (listingId) => {
    if (!isLoggedIn || !userId) return;

    const isAlreadyFavorited = favoriteIds.includes(listingId);

    try {
      const data = await toggleFavorite(listingId, token, isAlreadyFavorited);

      setFetchedData({ favorites: data.favorites });
    } catch (err) {
      console.error("❌ Failed to toggle favorite", err);
    }
  };

  return (
    <>
      <Container>
        <Heading size="lg" mb={4} mt={8}>
          {query}
        </Heading>

        <Box position="sticky" top="70px" bg="white" zIndex={10} py={3}>
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              {query && (
                <Text>
                  {count} {count === 1 ? "result" : "results"} for "{query}"
                </Text>
              )}

              {Object.values(filters).some((val) =>
                Array.isArray(val) ? val.length > 0 : val !== null
              ) && (
                <Button size="xs" variant="ghost" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </HStack>

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

        <Flex align="start" gap={6} mt={6}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isUsingMySizes={isUsingMySizes}
            setIsUsingMySizes={setIsUsingMySizes}
            query={query}
            mode="search"
          />

          <Box flex="1">
            {isLoading ? (
              <SearchResultsSkeleton />
            ) : (
              <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {sortedListings.map((item) => (
                  <Box key={item._id} overflow="hidden">
                    <Box
                      as="a"
                      href={`/listing/${item._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          noOfLines={1}
                          maxWidth="70%"
                        >
                          {item.designer}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.600"
                          whiteSpace="nowrap"
                        >
                          {item.size}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.600" noOfLines={1}>
                        {item.title}
                      </Text>
                      <HStack justify="space-between" mt={2}>
                        <HStack spacing={2}>
                          {item.originalPrice && (
                            <Text
                              fontSize="sm"
                              color="gray.500"
                              sx={{
                                textDecoration: "line-through",
                                textDecorationThickness: "2px",
                              }}
                            >
                              ${item.originalPrice.toLocaleString()}
                            </Text>
                          )}
                          <Text fontSize="sm" fontWeight="bold">
                            ${item.price.toLocaleString()}
                          </Text>
                        </HStack>

                        {userId !== item.seller && (
                          <IconButton
                            size="sm"
                            icon={
                              favoriteIds.includes(item._id) ? (
                                <FaHeart color="black" />
                              ) : (
                                <FaRegHeart />
                              )
                            }
                            aria-label={
                              favoriteIds.includes(item._id)
                                ? "Unfavorite"
                                : "Favorite"
                            }
                            onClick={() =>
                              isLoggedIn
                                ? handleFavorite(item._id)
                                : onOpenAuthModal("register")
                            }
                          />
                        )}
                      </HStack>
                    </Box>
                  </Box>
                ))}
              </Grid>
            )}
          </Box>
        </Flex>
      </Container>
      <Footer />
    </>
  );
}
