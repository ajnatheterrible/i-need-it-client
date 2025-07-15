import {
  Box,
  Skeleton,
  SkeletonText,
  HStack,
  VStack,
  SkeletonCircle,
} from "@chakra-ui/react";

export default function FavoritesSkeleton() {
  const cards = Array.from({ length: 5 });

  const skeletonProps = {
    startColor: "gray.150",
    endColor: "gray.200",
  };

  return (
    <>
      {cards.map((_, i) => (
        <Box key={i} overflow="hidden" {...skeletonProps}>
          <Skeleton height="200px" width="100%" />

          <Box p={3}>
            <Skeleton height="10px" width="50%" mb={2} />

            <Box borderBottom="1px solid" borderColor="gray.200" my={2} />

            <HStack justify="space-between" mb={1}>
              <Skeleton height="12px" width="60%" />
              <Skeleton height="12px" width="20%" />
            </HStack>

            <Skeleton height="10px" width="80%" mt={1} />

            <HStack justify="space-between" mt={4}>
              <Skeleton height="14px" width="50px" />
              <SkeletonCircle size="8" />
            </HStack>
          </Box>
        </Box>
      ))}
    </>
  );
}
