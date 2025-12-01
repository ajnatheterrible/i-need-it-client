import {
  VStack,
  Text,
  Flex,
  Box,
  Skeleton,
  SkeletonText,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReviewCard from "../components/ui/ReviewCard";
import Container from "../components/shared/Container";
import useAuthStore from "../store/authStore";

const SkeletonReviewRow = () => (
  <Flex justify="space-between" align="flex-start" w="full">
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
);

const UserReviews = () => {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState([]);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);

  useEffect(() => {
    if (!user?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/feedback/seller/${user._id}`);
        const data = res.ok ? await res.json() : [];
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setHasFetchedReviews(true);
      }
    };

    fetchReviews();
  }, [user?._id]);

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;
  const isLoading = !hasFetchedReviews && !!user?._id;

  return (
    <Container>
      <Flex justify="center">
        <VStack spacing={6} align="stretch" py={10}>
          {isLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <Box key={idx} w="full" display="flex" justifyContent="center">
                <Box w="700px">
                  <SkeletonReviewRow />
                  {idx < 2 && <Divider my={6} borderColor="gray.200" />}
                </Box>
              </Box>
            ))}

          {!isLoading && hasFetchedReviews && hasReviews && (
            <motion.div
              key="reviews-list"
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
              key="no-reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Box w="full" display="flex" justifyContent="center">
                <Box w="700px">
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    No reviews yet
                  </Text>
                </Box>
              </Box>
            </motion.div>
          )}
        </VStack>
      </Flex>
    </Container>
  );
};

export default UserReviews;
