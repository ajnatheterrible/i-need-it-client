import { Box, Text, HStack, Button } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useAuthStore from "../../store/authStore";
import { formatCurrency } from "../../utils/priceUtils";
import AcceptSellerOfferModal from "../modals/AcceptSellerOfferModal";

dayjs.extend(relativeTime);

export default function OfferCard({
  message,
  offer,
  snapshot,
  viewerIsSeller,
  viewerIsBuyer,
  onNewMessage,
}) {
  const token = useAuthStore((s) => s.token);
  const [status, setStatus] = useState(
    snapshot.status || offer.status || "pending"
  );
  const [loading, setLoading] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  const expiresAt = useMemo(
    () => (offer?.expiresAt ? dayjs(offer.expiresAt) : null),
    [offer?.expiresAt]
  );

  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!expiresAt || status !== "pending") return;
    const tick = () => {
      const diff = expiresAt.diff(dayjs());
      if (diff <= 0) {
        setStatus("expired");
        return;
      }
      const s = Math.floor(diff / 1000);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const r = s % 60;
      setCountdown(`Expires in ${h}h ${m}m ${r}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, status]);

  const handle = async (type) => {
    if (!offer?._id || !token || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/offers/${offer._id}/${type}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("action failed");
      const data = await res.json();
      setStatus(type === "accept" ? "accepted" : "declined");
      if (onNewMessage && data.updatedMessage)
        onNewMessage(data.updatedMessage);
      if (onNewMessage && data.orderMessage) onNewMessage(data.orderMessage);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const Bold = (props) => <Text as="span" fontWeight="semibold" {...props} />;

  const amount =
    snapshot.amount_cents != null
      ? formatCurrency((snapshot.amount_cents / 100).toFixed(0))
      : "$—";

  const isBuyerOffer = offer.mode === "buyer";
  const isSellerOffer =
    offer.mode === "seller_private" || offer.mode === "seller_broadcast";

  let title = "Offer";
  let body;

  if (status === "pending") {
    title = "New Offer";

    if (isBuyerOffer) {
      if (viewerIsSeller) {
        body = (
          <>
            <Bold>{offer?.buyer?.username || "Buyer"}</Bold> offered{" "}
            <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsBuyer) {
        body = (
          <>
            You sent a binding offer of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            Offer of <Bold>{amount}</Bold> is pending.
          </>
        );
      }
    } else if (isSellerOffer) {
      if (viewerIsBuyer) {
        body = (
          <>
            You received a binding offer of <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsSeller) {
        body = (
          <>
            You sent an offer of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            Offer of <Bold>{amount}</Bold> is pending.
          </>
        );
      }
    } else {
      if (viewerIsSeller) {
        body = (
          <>
            <Bold>{offer?.buyer?.username || "Buyer"}</Bold> offered{" "}
            <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsBuyer) {
        body = (
          <>
            You sent a binding offer of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            Offer of <Bold>{amount}</Bold> is pending.
          </>
        );
      }
    }
  } else if (status === "declined") {
    title = "Offer Declined";

    if (isBuyerOffer) {
      if (viewerIsSeller) {
        body = (
          <>
            You declined <Bold>{offer?.buyer?.username || "Buyer"}</Bold>’s
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsBuyer) {
        body = (
          <>
            <Bold>{offer?.seller?.username || "Seller"}</Bold> declined your
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            The offer of <Bold>{amount}</Bold> was declined.
          </>
        );
      }
    } else if (isSellerOffer) {
      if (viewerIsBuyer) {
        body = (
          <>
            You declined <Bold>{offer?.seller?.username || "Seller"}</Bold>’s
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsSeller) {
        body = (
          <>
            <Bold>{offer?.buyer?.username || "Buyer"}</Bold> declined your offer
            of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            The offer of <Bold>{amount}</Bold> was declined.
          </>
        );
      }
    } else {
      body = (
        <>
          The offer of <Bold>{amount}</Bold> was declined.
        </>
      );
    }
  } else if (status === "accepted") {
    title = "Offer Accepted";

    if (isBuyerOffer) {
      if (viewerIsSeller) {
        body = (
          <>
            You accepted <Bold>{offer?.buyer?.username || "Buyer"}</Bold>’s
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsBuyer) {
        body = (
          <>
            <Bold>{offer?.seller?.username || "Seller"}</Bold> accepted your
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            The offer of <Bold>{amount}</Bold> was accepted.
          </>
        );
      }
    } else if (isSellerOffer) {
      if (viewerIsBuyer) {
        body = (
          <>
            You accepted <Bold>{offer?.seller?.username || "Seller"}</Bold>’s
            offer of <Bold>{amount}</Bold>
          </>
        );
      } else if (viewerIsSeller) {
        body = (
          <>
            <Bold>{offer?.buyer?.username || "Buyer"}</Bold> accepted your offer
            of <Bold>{amount}</Bold>
          </>
        );
      } else {
        body = (
          <>
            The offer of <Bold>{amount}</Bold> was accepted.
          </>
        );
      }
    } else {
      body = (
        <>
          The offer of <Bold>{amount}</Bold> was accepted.
        </>
      );
    }
  } else if (status === "expired") {
    title = "Offer Expired";
    body = (
      <>
        The offer of <Bold>{amount}</Bold> has expired.
      </>
    );
  }

  const showSellerButtons =
    status === "pending" && isBuyerOffer && viewerIsSeller;

  const showBuyerButtons =
    status === "pending" && isSellerOffer && viewerIsBuyer;

  return (
    <Box textAlign="center">
      <Text
        fontSize="md"
        fontWeight="bold"
        mb={2}
        color={status === "declined" ? "red.500" : "black"}
      >
        {title}
      </Text>

      <Box fontSize="sm" color="gray.700" textAlign="left">
        {body}
      </Box>

      {status === "pending" && countdown && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          {countdown}
        </Text>
      )}

      {status === "pending" && (
        <>
          {showSellerButtons && (
            <HStack spacing={3} w="full" mt={2}>
              <Button
                flex="1"
                size="sm"
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
                onClick={() => handle("accept")}
                isLoading={loading}
              >
                Accept
              </Button>
              <Button
                flex="1"
                size="sm"
                bg="gray.200"
                color="black"
                _hover={{ bg: "gray.300" }}
                onClick={() => handle("decline")}
                isLoading={loading}
              >
                Decline
              </Button>
            </HStack>
          )}

          {showBuyerButtons && (
            <>
              <HStack spacing={3} w="full" mt={2}>
                <Button
                  flex="1"
                  size="sm"
                  bg="black"
                  color="white"
                  _hover={{ bg: "gray.800" }}
                  onClick={() => setIsAcceptModalOpen(true)}
                >
                  Accept
                </Button>

                <Button
                  flex="1"
                  size="sm"
                  bg="gray.200"
                  color="black"
                  _hover={{ bg: "gray.300" }}
                  onClick={() => handle("decline")}
                >
                  Decline
                </Button>
              </HStack>

              <AcceptSellerOfferModal
                isOpen={isAcceptModalOpen}
                onClose={() => setIsAcceptModalOpen(false)}
                offer={offer}
                listing={offer?.listing}
                onSuccess={(data) => {
                  setStatus("accepted");
                  if (!onNewMessage) return;
                  if (data.updatedMessage) onNewMessage(data.updatedMessage);
                  if (data.orderMessage) onNewMessage(data.orderMessage);
                }}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
}
