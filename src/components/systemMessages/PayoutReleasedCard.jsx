import { Box, Text } from "@chakra-ui/react";
import { formatCentsToDollars } from "../../utils/priceUtils";

export default function PayoutReleasedCard({ data }) {
  const orderId = data.orderId;
  const totalCents = data.net_cents || 0;
  const formattedAmount = formatCentsToDollars(totalCents);

  return (
    <Box textAlign="left">
      <Text fontSize="md" fontWeight="bold" textAlign="center" mb={2}>
        Payout Released
      </Text>

      <Box
        border="1px solid"
        borderColor="blue.200"
        bg="blue.50"
        borderRadius="md"
        p={5}
      >
        <Text fontSize="sm" mb={2}>
          💰 <b>{formattedAmount}</b> was sent to your bank account. Your
          payment may take <b>3–5 business days</b> to process, depending on
          your bank and country.
        </Text>

        <Text fontSize="sm" color="blue.700" mt={3}>
          <a
            href={`http://localhost:5173/orders/${orderId}`}
            style={{ textDecoration: "underline" }}
          >
            View Order Details
          </a>
        </Text>
      </Box>
    </Box>
  );
}
