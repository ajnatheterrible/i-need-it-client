import { VStack, Text, Flex } from "@chakra-ui/react";
import ReviewCard from "../components/ui/ReviewCard";
import Container from "../components/shared/Container";

const dummyReviews = [
  {
    id: 1,
    date: "June 1, 2025",
    rating: 5,
    content:
      "Great seller! Quick communication and fast shipping. Would buy again.",
    item: {
      brand: "Rick Owens",
      title: "Geobasket",
      slug: "rick-owens-geobasket",
    },
  },
  {
    id: 2,
    date: "May 20, 2025",
    rating: 4,
    content: "Item came as described, slight delay in shipping but no biggie.",
    item: {
      brand: "Guerrilla Group",
      title: "Modular Vest",
      slug: "gg-modular-vest",
    },
  },
];

const UserReviews = () => {
  const hasFetchedReviews = true;
  const hasReviews = Array.isArray(dummyReviews) && dummyReviews.length > 0;

  return (
    <Container>
      <Flex justify="center">
        <VStack spacing={6} align="stretch" py={10}>
          {hasFetchedReviews && hasReviews ? (
            dummyReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : hasFetchedReviews && !hasReviews ? (
            <Text fontSize="sm" color="gray.500">
              No reviews yet
            </Text>
          ) : null}
        </VStack>
      </Flex>
    </Container>
  );
};

export default UserReviews;
