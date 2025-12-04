import { Box, Text } from "@chakra-ui/react";

export default function RefundIssuedCard({
  data,
  viewerIsSeller,
  viewerIsBuyer,
  amount,
}) {
  const mode = (data.mode || "").toLowerCase();
  const isFull = mode === "full";

  const title = isFull ? "Refund Issued" : "Partial Refund Issued";

  const refundDescriptor = isFull
    ? "a full refund of "
    : "a partial refund of ";

  let prefix;
  let suffix = ".";

  if (viewerIsSeller) {
    prefix = "You issued the buyer ";
  } else if (viewerIsBuyer) {
    prefix = "The seller issued you ";
  } else {
    prefix = "A ";
    suffix = " was issued.";
  }

  return (
    <Box textAlign="left">
      <Text fontSize="md" fontWeight="bold" textAlign="center" mb={2}>
        {title}
      </Text>

      <Box
        border="1px solid"
        borderColor="gray.300"
        bg="white"
        borderRadius="md"
        p={5}
      >
        <Text fontSize="sm" color="gray.800">
          {prefix}
          {refundDescriptor}
          <Text as="span" color="red.500" fontWeight="semibold">
            {amount}
          </Text>
          {suffix}
        </Text>

        {data.reason && (
          <Text fontSize="xs" color="gray.600" mt={3}>
            <Text as="span" fontWeight="semibold">
              Reason:
            </Text>{" "}
            {data.reason}
          </Text>
        )}
      </Box>
    </Box>
  );
}
