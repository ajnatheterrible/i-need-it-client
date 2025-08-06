import {
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Button,
} from "@chakra-ui/react";

export default function ForSaleSkeleton() {
  const cards = Array.from({ length: 6 });

  const skeletonProps = {
    startColor: "gray.150",
    endColor: "gray.200",
  };

  return (
    <SimpleGrid columns={3} spacing={6} w="full">
      {cards.map((_, i) => (
        <Box key={i} overflow="hidden" mb={6}>
          <HStack align="start" spacing={0}>
            <Box
              position="relative"
              height="150px"
              w="110px"
              bg="gray.100"
              flexShrink={0}
            >
              <Skeleton height="100%" width="100%" {...skeletonProps} />
            </Box>

            <Box p={3} flex="1">
              <Skeleton height="10px" width="50%" mb={2} {...skeletonProps} />

              <HStack justify="space-between" mt={1}>
                <Skeleton height="12px" width="60%" {...skeletonProps} />
                <Skeleton height="12px" width="20%" {...skeletonProps} />
              </HStack>

              <Skeleton height="10px" width="80%" mt={2} {...skeletonProps} />

              <HStack justify="space-between" align="baseline" w="full" mt={6}>
                <Skeleton height="12px" width="40px" {...skeletonProps} />
                <HStack spacing={1}>
                  <Skeleton height="10px" width="10px" {...skeletonProps} />
                  <SkeletonCircle size="3" {...skeletonProps} />
                </HStack>
              </HStack>
            </Box>
          </HStack>

          <HStack spacing={2} mt={4} align="start" px={3}>
            <Skeleton height="32px" width="100%" {...skeletonProps} />
            <Skeleton height="32px" width="100%" {...skeletonProps} />
            <Skeleton height="32px" width="100%" {...skeletonProps} />
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
