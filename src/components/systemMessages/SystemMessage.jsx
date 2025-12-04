import { Box, VStack, HStack, Text, Icon } from "@chakra-ui/react";
import { ViewOffIcon } from "@chakra-ui/icons";
import useAuthStore from "../../store/authStore";
import { formatCentsToDollars } from "../../utils/priceUtils";

import OfferCard from "./OfferCard";
import OrderCreatedCard from "./OrderCreatedCard";
import PayoutReleasedCard from "./PayoutReleasedCard";
import OrderUpdateCard from "./OrderUpdateCard";
import RefundIssuedCard from "./RefundIssueCard";

const toId = (v) => (v && typeof v === "object" ? v._id || v.id : v);

export default function SystemMessage({ message, onNewMessage }) {
  const userId = useAuthStore((s) => s.user?._id);

  const offer = message.offer || {};
  const snapshot = message.offerSnapshot || {};
  const system = message.system || {};
  const data = system.data || {};

  const sellerId = toId(data.seller) || toId(offer.seller);
  const buyerId = toId(data.buyer) || toId(offer.buyer);

  const viewerIsSeller = String(userId) === String(sellerId);
  const viewerIsBuyer = String(userId) === String(buyerId);

  if (system?.event === "payout_released" && !viewerIsSeller) return null;

  const refundAmountCents =
    typeof data.amount_cents === "number" ? data.amount_cents : null;

  const amount = snapshot.amount_cents
    ? formatCentsToDollars(snapshot.amount_cents)
    : refundAmountCents != null
    ? formatCentsToDollars(refundAmountCents)
    : typeof data.total_cents === "number"
    ? formatCentsToDollars(data.total_cents)
    : typeof data.net_cents === "number"
    ? formatCentsToDollars(data.net_cents)
    : "$—";

  let content;

  switch (system.event) {
    case "order_created":
      content = (
        <OrderCreatedCard
          data={data}
          offer={offer}
          amount={amount}
          viewerIsSeller={viewerIsSeller}
          viewerIsBuyer={viewerIsBuyer}
        />
      );
      break;

    case "payout_released":
      content = viewerIsSeller && (
        <PayoutReleasedCard data={data} amount={amount} />
      );
      break;

    case "order_shipped":
    case "order_delivered":
      content = (
        <OrderUpdateCard
          event={system.event}
          data={data}
          viewerIsSeller={viewerIsSeller}
        />
      );
      break;

    case "refund_issued":
      content = (
        <RefundIssuedCard
          data={data}
          viewerIsSeller={viewerIsSeller}
          viewerIsBuyer={viewerIsBuyer}
          amount={amount}
        />
      );
      break;

    default:
      content = (
        <OfferCard
          message={message}
          offer={offer}
          snapshot={snapshot}
          viewerIsSeller={viewerIsSeller}
          viewerIsBuyer={viewerIsBuyer}
          onNewMessage={onNewMessage}
        />
      );
  }

  return (
    <Box
      w="50%"
      border="1px solid"
      borderColor="gray.200"
      bg="gray.50"
      borderRadius="lg"
      p={4}
    >
      <VStack spacing={3}>
        {content}
        <HStack
          spacing={1.5}
          align="center"
          color="gray.500"
          fontSize="xs"
          pt={1}
        >
          <Icon as={ViewOffIcon} boxSize={3} />
          <Text>
            This message is only visible to you. Do not reply to this message.
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
