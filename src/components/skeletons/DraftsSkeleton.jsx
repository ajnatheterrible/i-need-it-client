import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Skeleton,
  SkeletonText,
  Button,
  SkeletonCircle,
  Progress,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";

export default function DraftsSkeleton() {
  const skeletonProps = {
    startColor: "gray.150",
    endColor: "gray.200",
  };

  return (
    <SimpleGrid columns={[1, null, 2]} spacing={8} w="full" maxW="1000px">
      {[1, 2].map((_, i) => (
        <Box key={i} w="full" maxW="400px">
          <Flex align="start" gap={4}>
            <Skeleton
              w="120px"
              h="120px"
              flexShrink={0}
              mt="2px"
              {...skeletonProps}
            />
            <VStack align="start" spacing={3} w="full">
              <Skeleton height="12px" width="60px" {...skeletonProps} />
              <SkeletonText
                noOfLines={2}
                spacing="1"
                width="100%"
                {...skeletonProps}
              />
              <HStack spacing={2} w="full">
                <Progress
                  value={i === 0 ? 18 : 100}
                  size="xs"
                  colorScheme="blue"
                  flex={1}
                />
                <Skeleton height="10px" width="60px" {...skeletonProps} />
              </HStack>
            </VStack>
          </Flex>

          <VStack spacing={2} pt={3} w="full">
            <Skeleton
              height="32px"
              width="100%"
              borderRadius="md"
              {...skeletonProps}
            />
            <Skeleton
              height="32px"
              width="100%"
              borderRadius="md"
              {...skeletonProps}
            />
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
