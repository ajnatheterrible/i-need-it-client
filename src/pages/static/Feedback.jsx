import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Flex,
  Skeleton,
  SkeletonText,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import SellerSidebar from "../../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../../components/profile/SellerProfileHeader";
import ReviewCard from "../../components/ui/ReviewCard";
import useAuthStore from "../../store/authStore";

const SkeletonReviewRow = () => (
  <Box w="full" display="flex" justifyContent="center">
    <Box w="700px">
      <Flex justify="space-between" align="flex-start">
        <VStack align="start" spacing={3} maxW="calc(100% - 120px)">
          <Skeleton height="14px" width="120px" />

          <HStack spacing={1}>
            {Array(5)
              .fill("")
              .map((_, i) => (
                <Skeleton key={i} boxSize={4} borderRadius="full" />
              ))}
          </HStack>

          <SkeletonText noOfLines={2} spacing="2" w="80%" />

          <Skeleton height="14px" width="60%" />

          <Box mt={1}>
            <Skeleton height="14px" width="80px" mb={1} />
            <Skeleton height="14px" width="150px" />
          </Box>
        </VStack>

        <Box ml={4} w="100px" h="100px">
          <Skeleton w="100%" h="100%" />
        </Box>
      </Flex>
    </Box>
  </Box>
);

export default function Feedback() {
  const user = useAuthStore((s) => s.user);
  const sellerId = user?._id;

  const [reviews, setReviews] = useState([]);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);

  useEffect(() => {
    if (!sellerId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/feedback/seller/${sellerId}`);
        const reviewsData = res.ok ? await res.json() : [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch {
        setReviews([]);
      } finally {
        setHasFetchedReviews(true);
      }
    };

    fetchReviews();
  }, [sellerId]);

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;
  const isLoading = !hasFetchedReviews && !!sellerId;

  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            pt={6}
            pb={10}
            w="full"
          >
            <GridItem colSpan={2}>
              <SellerSidebar active="FEEDBACK" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Reviews
                </Text>

                <Flex justify="center" w="full">
                  <VStack spacing={6} align="stretch" w="full">
                    {isLoading &&
                      Array.from({ length: 3 }).map((_, idx) => (
                        <Box key={idx} mb={2}>
                          <SkeletonReviewRow />
                          {idx < 2 && (
                            <Box
                              w="full"
                              display="flex"
                              justifyContent="center"
                              mt={6}
                            >
                              <Box w="700px">
                                <Divider borderColor="gray.200" />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))}

                    {!isLoading && hasFetchedReviews && hasReviews && (
                      <motion.div
                        key="feedback-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <VStack spacing={6} align="stretch">
                          {reviews.map((review, idx) => (
                            <Box
                              key={review._id || idx}
                              w="full"
                              display="flex"
                              justifyContent="center"
                            >
                              <Box w="700px">
                                <ReviewCard review={review} />
                                {idx < reviews.length - 1 && (
                                  <Divider my={6} borderColor="gray.200" />
                                )}
                              </Box>
                            </Box>
                          ))}
                        </VStack>
                      </motion.div>
                    )}

                    {!isLoading && hasFetchedReviews && !hasReviews && (
                      <motion.div
                        key="no-feedback"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Box
                          w="full"
                          display="flex"
                          justifyContent="center"
                          mt={4}
                        >
                          <Text fontSize="sm" color="gray.500">
                            No feedback yet
                          </Text>
                        </Box>
                      </motion.div>
                    )}
                  </VStack>
                </Flex>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
