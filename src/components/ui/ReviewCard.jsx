import {
  Box,
  Flex,
  Text,
  Icon,
  HStack,
  VStack,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const TAG_LABELS = {
  FAST_SHIPPER: "Fast Shipper",
  ITEM_AS_DESCRIBED: "Item As Described",
  QUICK_REPLIES: "Quick Replies",
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStarColor = (rating, index) => {
  if (index > rating) return "gray.300";
  if (rating <= 1) return "red.400";
  if (rating === 2) return "orange.400";
  return "green.400";
};

export default function ReviewCard({ review }) {
  const rating = review?.rating || 0;
  const tags = Array.isArray(review?.tags) ? review.tags : [];
  const createdAt = review?.createdAt || review?.order?.createdAt;

  const brand = review?.order?.listingSnapshot?.designer;
  const title = review?.order?.listingSnapshot?.title;
  const imgUrl = review?.order?.listingSnapshot?.imageUrl;

  const listingId =
    review?.order?.listing ||
    review?.order?.listingSnapshot?.listingId ||
    review?.order?.listingSnapshot?._id;

  const listingHref = listingId ? `/listing/${listingId}` : "#";
  const canNavigate = Boolean(listingId);

  return (
    <Flex justify="space-between" align="flex-start" w="full">
      <VStack align="start" spacing={3} maxW="calc(100% - 120px)">
        <Text fontSize="xs" fontWeight="semibold" color="gray.800">
          {formatDate(createdAt)}
        </Text>

        <HStack spacing={1}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Icon
              key={i}
              as={FaStar}
              boxSize={3}
              color={getStarColor(rating, i)}
            />
          ))}
        </HStack>

        <Text fontSize="sm">{review?.comment}</Text>

        {tags.length > 0 && (
          <HStack spacing={2} wrap="wrap">
            {tags.map((tag) => (
              <Button
                key={tag}
                size="xs"
                variant="outline"
                color="gray.600"
                fontSize="xs"
              >
                {TAG_LABELS[tag] || tag}
              </Button>
            ))}
          </HStack>
        )}

        {(brand || title) && (
          <VStack align="start" spacing={0} pt={2}>
            {brand && (
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                {brand}
              </Text>
            )}
            {title && (
              <ChakraLink
                as={canNavigate ? RouterLink : "span"}
                to={canNavigate ? listingHref : undefined}
                fontSize="xs"
                color="gray.600"
                textDecoration={canNavigate ? "underline" : "none"}
                _hover={
                  canNavigate
                    ? { color: "gray.800", textDecoration: "underline" }
                    : {}
                }
              >
                {title}
              </ChakraLink>
            )}
          </VStack>
        )}
      </VStack>

      {imgUrl ? (
        <Box
          as={canNavigate ? RouterLink : "div"}
          to={canNavigate ? listingHref : undefined}
          w="100px"
          h="100px"
          ml={4}
          flexShrink={0}
          _hover={canNavigate ? { opacity: 0.9 } : {}}
        >
          <Box
            as="img"
            src={imgUrl}
            alt={title || "Listing image"}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>
      ) : (
        <Box w="100px" h="100px" bg="gray.200" ml={4} flexShrink={0} />
      )}
    </Flex>
  );
}
