import {
  Box,
  Text,
  Select,
  HStack,
  Grid,
  Image,
  Badge,
  Flex,
} from "@chakra-ui/react";
import FilterSidebar from "../../components/sidebars/FilterSidebar";

import { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import { hasFetchedForSaleRef } from "../../hooks/useFetchForSale";
import useFetchForSale from "../../hooks/useFetchForSale";
import useFetchSizes from "../../hooks/useFetchSizes";
import getTimestamp from "../../utils/getTimestamp";

export default function Profile() {
  const [filters, setFilters] = useState({
    department: [],
    category: [],
    size: [],
    condition: [],
    priceMin: null,
    priceMax: null,
  });
  const [isUsingMySizes, setIsUsingMySizes] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  useFetchSizes();
  useFetchForSale();

  const sizes = useAuthStore((s) => s.fetchedData?.sizes);
  const forSale = useAuthStore((s) => s.fetchedData?.forSale);

  const filtered = useMemo(() => {
    if (!Array.isArray(forSale)) return [];

    const mySizeList =
      isUsingMySizes && sizes
        ? Object.values(sizes)
            .map((catObj) => Object.values(catObj).flat())
            .flat()
        : filters.size;

    return forSale.filter((listing) => {
      if (mySizeList?.length && !mySizeList.includes(listing.size))
        return false;
      if (
        filters.condition.length &&
        !filters.condition.includes(listing.condition)
      )
        return false;
      if (
        filters.department.length &&
        !filters.department.includes(listing.department)
      )
        return false;
      if (
        filters.category.length &&
        !filters.category.includes(listing.category)
      )
        return false;
      if (filters.priceMin !== null && listing.price < filters.priceMin)
        return false;
      if (filters.priceMax !== null && listing.price > filters.priceMax)
        return false;
      return true;
    });
  }, [forSale, filters, isUsingMySizes, sizes]);

  const sortedListings = useMemo(() => {
    const hasActiveFilters =
      isUsingMySizes ||
      Object.values(filters).some((val) =>
        Array.isArray(val) ? val.length > 0 : Boolean(val)
      );

    const base = hasActiveFilters ? filtered : forSale ?? [];

    return [...base].sort((a, b) => {
      if (sortOption === "price_low_high") return a.price - b.price;
      if (sortOption === "price_high_low") return b.price - a.price;
      if (sortOption === "recent")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  }, [filtered, sortOption, forSale]);

  if (!hasFetchedForSaleRef.current) {
    return null;
  }

  return (
    <>
      <Box position="sticky" top="70px" bg="white" zIndex={10} py={6}>
        <Flex justify="space-between" align="center">
          <Text fontWeight="semibold">
            {sortedListings.length === 1
              ? `${sortedListings.length} listing`
              : `${sortedListings.length} listings`}
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

      <Flex align="start" gap={6} mt={3}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isUsingMySizes={isUsingMySizes}
          setIsUsingMySizes={setIsUsingMySizes}
          mode="profile"
        />

        <Box flex="1">
          {sortedListings.length === 0 ? (
            <Box py={20} textAlign="center" width="100%">
              <Text fontSize="sm" color="gray.500">
                You haven’t listed anything for sale yet
              </Text>
            </Box>
          ) : (
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {sortedListings.map((item, i) => (
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
                    <Text fontSize="sm" fontWeight="bold" mt={4}>
                      ${item.price?.toLocaleString()}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Flex>
    </>
  );
}
