import { Box, Text, Link } from "@chakra-ui/react";
import DeliveryPhotoWidget from "../ui/DeliveryPhotoWidget";

export default function OrderUpdateCard({ event, data, viewerIsSeller }) {
  const titles = {
    order_shipped: "Order Shipped",
    order_delivered: "Order Delivered",
  };

  const messages = {
    order_shipped: viewerIsSeller
      ? "You marked the order as shipped. Tracking is now visible to the buyer. 🚚"
      : "Your order has been shipped! 🚚 Tracking details are available below.",
    order_delivered: viewerIsSeller
      ? "The buyer’s package has been marked as delivered. 📦 The buyer has 3 days to report any issues. If no issues are raised, your payout will be released automatically."
      : "Your package has been delivered! 📦 Please confirm receipt.",
  };

  const orderId = data.orderId;
  const trackingNumber = data.trackingNumber;

  return (
    <Box textAlign="left">
      <Text fontSize="md" fontWeight="bold" textAlign="center" mb={2}>
        {titles[event]}
      </Text>

      <Box
        border="1px solid"
        borderColor="gray.300"
        bg="white"
        borderRadius="md"
        p={5}
      >
        <Text fontSize="sm" mb={3} lineHeight="taller">
          {messages[event]}
        </Text>

        {event === "order_shipped" && trackingNumber && (
          <Text fontSize="sm" mb={3}>
            <b>Tracking:</b>{" "}
            <Text
              as="span"
              color="blue.600"
              textDecoration="underline"
              cursor="pointer"
            >
              {trackingNumber}
            </Text>
          </Text>
        )}

        {event === "order_delivered" && !viewerIsSeller && (
          <Box mt={4}>
            <DeliveryPhotoWidget orderId={orderId} />
          </Box>
        )}

        <Text fontSize="sm" color="blue.700" mt={4}>
          <Link
            href={`http://localhost:5173/orders/${orderId}`}
            textDecoration="underline"
          >
            View Order Details
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
