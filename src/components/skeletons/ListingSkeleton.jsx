import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  Flex,
  Divider,
} from "@chakra-ui/react";
import Container from "../shared/Container";
import Footer from "../layout/Footer";

const skeletonProps = {
  startColor: "gray.150",
  endColor: "gray.200",
};

export default function ListingSkeleton() {
  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={10}>
          <GridItem colSpan={[12, null, 8]}>
            <Flex justify="center">
              <Skeleton height="600px" width="600px" {...skeletonProps} />
            </Flex>

            <HStack mt={4} spacing={2}>
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  height="80px"
                  width="100px"
                  {...skeletonProps}
                />
              ))}
            </HStack>
          </GridItem>

          <GridItem colSpan={[12, null, 4]}>
            <VStack align="start" spacing={5}>
              <Skeleton height="30px" width="60%" {...skeletonProps} />
              <Skeleton height="16px" width="40%" {...skeletonProps} />
              <Skeleton height="16px" width="20%" {...skeletonProps} />
              <Skeleton height="30px" width="80px" mt={4} {...skeletonProps} />

              <Skeleton height="40px" width="100%" {...skeletonProps} />
              <HStack w="100%">
                <Skeleton height="40px" width="200px" {...skeletonProps} />
                <Skeleton height="40px" width="200px" {...skeletonProps} />
              </HStack>

              <Divider />

              <Skeleton height="16px" width="40%" {...skeletonProps} />
              <HStack spacing={4} align="center">
                <SkeletonCircle
                  size="10"
                  startColor="gray.50"
                  endColor="gray.100"
                />
                <Skeleton height="16px" width="80px" {...skeletonProps} />
              </HStack>
              <Skeleton height="16px" width="80%" {...skeletonProps} />

              <Skeleton height="16px" width="10%" mt={4} {...skeletonProps} />
              <HStack>
                <Skeleton height="20px" width="60px" {...skeletonProps} />
                <Skeleton height="20px" width="60px" {...skeletonProps} />
              </HStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
