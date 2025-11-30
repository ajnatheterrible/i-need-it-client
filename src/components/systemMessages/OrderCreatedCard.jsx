import { Box, Text, VStack } from "@chakra-ui/react";

export default function OrderCreatedCard({
  data,
  offer,
  amount,
  viewerIsSeller,
  viewerIsBuyer,
}) {
  const listingTitle = offer?.listing?.title || data.title || "this item";
  const orderId = data.orderId;
  const shippingAddress = data.shippingAddress;
  const buyerName = data.buyerName || offer?.buyer?.username || "Buyer";
  const sellerName = data.sellerName || offer?.seller?.username || "Seller";
  const headerTitle = viewerIsSeller ? "Sale Confirmed" : "Order Confirmed";

  return (
    <Box textAlign="left">
      <Text fontSize="md" fontWeight="bold" textAlign="center" mb={2}>
        {headerTitle}
      </Text>

      {viewerIsSeller ? (
        <Box
          border="1px solid"
          borderColor="gray.300"
          bg="blue.50"
          borderRadius="md"
          p={5}
          fontSize="sm"
        >
          <Text mb={2}>
            You just sold <b>{listingTitle}</b> for <b>{amount}</b>.
          </Text>
          <Text mb={3}>
            <b>Get Ready to Ship!</b> We’ve created an order and shared it with
            the buyer. Package your item securely and ship it within{" "}
            <b>7 days</b> to avoid cancellation.
          </Text>

          <VStack align="start" spacing={1} mb={3}>
            <Text>
              <b>Shipping Method:</b> Standard
            </Text>
            <Text>
              <b>Buyer:</b> {buyerName}
            </Text>
            <Text>
              <b>Destination:</b>{" "}
              {shippingAddress?.line1 ? (
                <>
                  {shippingAddress.fullName && (
                    <>
                      {shippingAddress.fullName}
                      <br />
                    </>
                  )}
                  {shippingAddress.line1}
                  {shippingAddress.line2 && (
                    <>
                      <br />
                      {shippingAddress.line2}
                    </>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.zip}
                  <br />
                  {shippingAddress.country}
                </>
              ) : (
                "(address available on order page)"
              )}
            </Text>
          </VStack>

          <Text mb={3}>
            You’ll receive a prepaid label if applicable, or you can upload
            tracking manually after shipping.
          </Text>

          <Text fontSize="sm" color="blue.700">
            <a
              href={`http://localhost:5173/orders/${orderId}`}
              style={{ textDecoration: "underline" }}
            >
              View Order Details
            </a>
          </Text>
        </Box>
      ) : (
        <Box
          border="1px solid"
          borderColor="gray.300"
          bg="green.50"
          borderRadius="md"
          p={5}
          fontSize="sm"
        >
          <Text mb={3}>
            You purchased <b>{listingTitle}</b> for <b>{amount}</b>.
          </Text>
          <Text mb={3}>
            We’ve notified <b>{sellerName}</b> to ship your item. You’ll receive
            tracking information as soon as it’s uploaded.
          </Text>

          <VStack align="start" spacing={1} mb={3}>
            <Text>
              <b>Shipping Method:</b> Standard
            </Text>
            {!viewerIsSeller && (
              <Text>
                <b>Payment Method:</b> Earned Credit
              </Text>
            )}
          </VStack>

          <Text fontSize="sm" color="blue.700">
            <a
              href={`http://localhost:5173/orders/${orderId}`}
              style={{ textDecoration: "underline" }}
            >
              View Order Details
            </a>
          </Text>
        </Box>
      )}
    </Box>
  );
}
