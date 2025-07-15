import { Box, Flex, Text, Icon, Tag, HStack, VStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

export default function ReviewCard({ review }) {
  const { date, rating, content, tags, item } = review;

  return (
    <Flex
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p={4}
      justify="space-between"
      align="start"
      w="660px"
    >
      <VStack align="start" spacing={3} flex="1">
        <Text fontSize="sm" fontWeight="semibold">
          {date}
        </Text>

        <HStack spacing={1}>
          {Array(rating)
            .fill("")
            .map((_, i) => (
              <Icon as={StarIcon} key={i} color="green.400" />
            ))}
        </HStack>

        <Text fontSize="sm">{content}</Text>

        {tags && (
          <HStack spacing={2}>
            {tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))}
          </HStack>
        )}

        <Box mt={1}>
          <Text fontWeight="bold" fontSize="sm">
            {item?.brand?.toUpperCase()}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {item?.title}
          </Text>
        </Box>
      </VStack>

      <Box
        ml={6}
        minW="80px"
        w="100px"
        h="120px"
        bg="gray.500"
        borderRadius="sm"
      />
    </Flex>
  );
}
