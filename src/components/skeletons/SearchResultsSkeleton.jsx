import {
  Box,
  Grid,
  VStack,
  Skeleton,
  SkeletonText,
  HStack,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ListingGridSkeleton() {
  const cards = Array.from({ length: 20 });

  const skeletonProps = {
    startColor: "gray.150",
    endColor: "gray.200",
    borderColor: "gray.200",
  };

  return (
    <Box flex="1">
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {cards.map((_, i) => (
          <Box key={i} overflow="hidden">
            <Box position="relative" height="200px">
              <Skeleton height="100%" width="100%" />
            </Box>

            <Box p={3}>
              <Skeleton height="10px" width="40%" mb={2} />

              <Box borderBottom="1px solid" borderColor="gray.200" my={2} />

              <HStack justify="space-between" mb={1}>
                <Skeleton height="12px" width="60%" />
                <Skeleton height="12px" width="20%" />
              </HStack>

              <Skeleton height="10px" width="80%" />
            </Box>

            <Box px={3} pb={3}>
              <HStack justify="space-between" mt={2}>
                <VStack spacing={1} align="start">
                  <Skeleton height="12px" width="40px" />
                  <Skeleton height="12px" width="60px" />
                </VStack>
                <SkeletonCircle size="8" />
              </HStack>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
