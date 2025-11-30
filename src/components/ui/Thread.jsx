import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Button,
  Spinner,
  Input,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";
import SystemMessage from "../systemMessages/SystemMessage";
import OfferModal from "../modals/OfferModal";
import SellerPrivateOfferModal from "../modals/SellerPrivateOfferModal";
import { formatCurrency } from "../../utils/priceUtils";

export default function Thread({
  thread: initialThread,
  token,
  view = "buy",
  onBump,
  onMarkRead = () => {},
}) {
  const [thread, setThread] = useState(initialThread);
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [activeSellerOffer, setActiveSellerOffer] = useState(null);
  const scrollerRef = useRef(null);
  const userId = useAuthStore((s) => s.user?._id);
  const setHasUnread = useAuthStore((s) => s.setHasUnread);

  const {
    isOpen: isOfferOpen,
    onOpen: onOfferOpen,
    onClose: onOfferClose,
  } = useDisclosure();

  const {
    isOpen: isSellerOfferOpen,
    onOpen: onSellerOfferOpen,
    onClose: onSellerOfferClose,
  } = useDisclosure();

  const fullDateTime = (dt) => {
    if (!dt) return "";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      hour12: true,
    }).format(new Date(dt));
  };

  const TITLE_MAX = 48;
  const truncateTitle = (s) => {
    if (!s) return "";
    if (s.length <= TITLE_MAX) return s;
    const sub = s.slice(0, TITLE_MAX - 1);
    const cut = sub.lastIndexOf(" ");
    return (cut > 0 ? sub.slice(0, cut) : sub) + "…";
  };

  const DESIGNER_MAX = 24;
  const truncateDesigner = (s) =>
    s && s.length > DESIGNER_MAX ? s.slice(0, DESIGNER_MAX - 1) + "…" : s;

  const MESSAGE_MAX = 60;
  const truncateMessage = (s) =>
    s && s.length > MESSAGE_MAX ? s.slice(0, MESSAGE_MAX - 1) + "…" : s;

  const getOwnerId = (m) => {
    if (m.type === "system") return m.actor?._id || m.actor || "";
    return m?.sender?._id || m?.sender || "";
  };

  const isMe = (m) => String(getOwnerId(m)) === String(userId);

  const viewerIsBuyer =
    String(userId) === String(thread?.buyer?._id || thread?.buyer);
  const viewerIsSeller =
    String(userId) === String(thread?.seller?._id || thread?.seller);

  const listing = thread?.listing || {};

  const lastMessage = thread?.lastMessage;

  const findLastNonPayoutInItems = () => {
    for (let i = items.length - 1; i >= 0; i--) {
      const m = items[i];
      if (m.type === "system" && m.system?.event === "payout_released")
        continue;
      return m;
    }
    return null;
  };

  const previewText = (() => {
    if (!lastMessage) return "";
    if (
      lastMessage.type === "system" &&
      lastMessage.system?.event === "payout_released" &&
      viewerIsBuyer &&
      items.length === 0
    )
      return "order delivered";
    if (
      lastMessage.type === "system" &&
      lastMessage.system?.event === "payout_released" &&
      viewerIsBuyer &&
      items.length
    ) {
      const last = findLastNonPayoutInItems();
      if (!last) return "";
      if (last.type === "system")
        return truncateMessage(last.system?.event.replaceAll("_", " "));
      if (last.type === "offer")
        return truncateMessage(
          last.offerSnapshot?.status
            ? `offer ${last.offerSnapshot.status}`
            : "offer created"
        );
      return truncateMessage(last.content);
    }
    if (lastMessage.type === "text")
      return truncateMessage(lastMessage.content || "");
    if (lastMessage.type === "system" && lastMessage.system?.event)
      return truncateMessage(lastMessage.system.event.replaceAll("_", " "));
    if (lastMessage.type === "offer")
      return truncateMessage(
        lastMessage.offerSnapshot?.status
          ? `offer ${lastMessage.offerSnapshot.status}`
          : "offer created"
      );
    return "";
  })();

  const displayDate = (() => {
    if (!lastMessage) return "";
    if (
      lastMessage.type === "system" &&
      lastMessage.system?.event === "payout_released" &&
      viewerIsBuyer &&
      items.length === 0
    )
      return fullDateTime(thread?.lastMessageAt);
    if (
      lastMessage.type === "system" &&
      lastMessage.system?.event === "payout_released" &&
      viewerIsBuyer &&
      items.length
    ) {
      const last = findLastNonPayoutInItems();
      return last ? fullDateTime(last.createdAt) : "";
    }
    return fullDateTime(thread?.lastMessageAt);
  })();

  const fetchInitial = async (force = false) => {
    if (!force && items.length) return;
    setLoading(true);

    const res = await fetch(`/api/messages/thread/${thread._id}?limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { messages, hasMore, nextCursor, pendingOffer, listing } =
      await res.json();

    setItems(messages);
    setHasMore(hasMore);
    setCursor(nextCursor);

    const last = messages.length ? messages[messages.length - 1] : null;

    setThread((p) => {
      const mergedListing = listing ? { ...p.listing, ...listing } : p.listing;
      return {
        ...p,
        lastMessage: last || p.lastMessage,
        lastMessageAt: (last && last.createdAt) || p.lastMessageAt,
        ...(pendingOffer !== undefined ? { pendingOffer: !!pendingOffer } : {}),
        listing: mergedListing,
      };
    });

    if (onBump && last) {
      onBump(thread._id, last);
    }

    queueMicrotask(() =>
      scrollerRef.current?.scrollTo({
        top: scrollerRef.current.scrollHeight,
      })
    );

    setLoading(false);
  };

  const loadOlder = async () => {
    if (!hasMore || !cursor) return;
    setLoading(true);

    const res = await fetch(
      `/api/messages/thread/${thread._id}?limit=5&before=${encodeURIComponent(
        cursor
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { messages, hasMore: more, nextCursor } = await res.json();
    const container = scrollerRef.current;
    const prevHeight = container?.scrollHeight ?? 0;

    setItems((p) => [...messages, ...p]);
    setHasMore(more);
    setCursor(nextCursor);

    queueMicrotask(() => {
      if (container) {
        const newHeight = container.scrollHeight;
        const delta = newHeight - prevHeight;
        container.scrollTop = (container.scrollTop || 0) + delta;
      }
    });

    setLoading(false);
  };

  const markRead = async () => {
    if (!thread?._id) return;

    await fetch(`/api/messages/${thread._id}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setThread((p) => ({ ...p, hasUnread: false }));
    onMarkRead(thread._id);

    const res = await fetch("/api/messages/unread-count", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHasUnread((data.unreadCount || 0) > 0);
  };

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      fetchInitial();
      markRead();
    }
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);

    const res = await fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ threadId: thread._id, content }),
    });

    const msg = await res.json();

    setItems((p) => [...p, msg]);
    setDraft("");

    if (onBump) onBump(thread._id, msg);

    queueMicrotask(() => {
      if (scrollerRef.current)
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    });

    setSending(false);
  };

  const handleSystemUpdate = (updatedMsg, orderMsg) => {
    setItems((p) => {
      let next = [...p];
      if (updatedMsg) {
        const idx = next.findIndex((m) => m._id === updatedMsg._id);
        if (idx !== -1) next[idx] = updatedMsg;
        else next.push(updatedMsg);
      }
      if (orderMsg) next.push(orderMsg);
      return next;
    });

    const finalMsg = orderMsg || updatedMsg;

    setThread((p) => ({
      ...p,
      lastMessage: finalMsg,
      lastMessageAt: finalMsg?.createdAt,
      pendingOffer: false,
      listing: {
        ...p.listing,
        isSold: true,
        buyer: p.listing?.buyer || userId,
        canOffer: p.listing?.canOffer,
      },
    }));

    setActiveSellerOffer(null);

    if (onBump && finalMsg) {
      onBump(thread._id, finalMsg);
    }
  };

  const isListingArchived =
    !!thread.archivedReason ||
    listing.isSold ||
    listing.isDeleted ||
    listing.isArchived;

  const showArchivedBanner =
    viewerIsBuyer &&
    (thread.archivedReason === "listing_deleted" ||
      thread.archivedReason === "sold_to_other" ||
      (!thread.archivedReason &&
        (listing.isDeleted ||
          listing.isArchived ||
          (listing.isSold &&
            String(listing.buyer || "") !== String(userId || "")))));

  const archivedBannerText =
    thread.archivedReason === "listing_deleted" || listing.isDeleted
      ? "This listing has been deleted"
      : "This listing has been sold";

  const canShowOfferButton =
    listing.canOffer &&
    !thread?.pendingOffer &&
    !listing.buyer &&
    !listing.isSold &&
    !listing.isDraft &&
    !listing.isDeleted &&
    (viewerIsBuyer || viewerIsSeller);

  useEffect(() => {
    if (
      !expanded ||
      !viewerIsBuyer ||
      !listing?._id ||
      listing.isDraft ||
      listing.isDeleted ||
      listing.isSold ||
      listing.buyer
    ) {
      setActiveSellerOffer(null);
      return;
    }

    const fetchActiveOffer = async () => {
      try {
        const res = await fetch(
          `/api/offers/active-seller-offer/${listing._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setActiveSellerOffer(null);
          return;
        }

        const data = await res.json();
        setActiveSellerOffer(data.offer || null);
      } catch {
        setActiveSellerOffer(null);
      }
    };

    fetchActiveOffer();
  }, [
    expanded,
    viewerIsBuyer,
    listing?._id,
    listing.isDraft,
    listing.isDeleted,
    listing.isSold,
    listing.buyer,
    token,
  ]);

  const baseListingPrice = listing?.price || 0;
  const sellerOfferPrice = activeSellerOffer
    ? activeSellerOffer.amount_cents / 100
    : null;
  const buyNowPrice = sellerOfferPrice ?? baseListingPrice;

  return (
    <Box
      w="full"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="none"
      _hover={!expanded ? { bg: "gray.50" } : {}}
      cursor="pointer"
      onClick={toggle}
      transition="background 0.2s"
      position="relative"
    >
      {thread.hasUnread && (
        <Box
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
          w="8px"
          h="8px"
          bg="black"
          borderRadius="full"
        />
      )}

      <HStack
        spacing={6}
        w="full"
        justify="space-between"
        align="center"
        p={4}
        pl="8"
        borderBottom={expanded ? "1px solid gray.200" : "none"}
      >
        <HStack spacing={4} w="320px" flexShrink={0} overflow="hidden">
          <Avatar
            size="md"
            name={thread?.listing?.designer}
            src={thread?.listing?.thumbnail}
            bg="gray.200"
            color="gray.700"
            opacity={isListingArchived ? 0.35 : 1}
          />
          <VStack spacing={1} align="start" w="full" overflow="hidden">
            <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
              {truncateDesigner(thread?.listing?.designer)}
            </Text>
            <Text
              as={RouterLink}
              to={`/listing/${thread?.listing?._id}`}
              fontSize="xs"
              color="gray.600"
              noOfLines={1}
              _hover={{ textDecoration: "underline" }}
              onClick={(e) => e.stopPropagation()}
            >
              {truncateTitle(thread?.listing?.title)}
            </Text>
          </VStack>
        </HStack>

        <Flex flex="1" align="center" px={4} minW={0}>
          {!expanded && (
            <Text fontSize="xs" color="gray.600" noOfLines={1}>
              {previewText}
            </Text>
          )}
        </Flex>

        <Box>
          {!expanded ? (
            <Text fontSize="xs" color="gray.500">
              {displayDate}
              <br />
              <Box as="span" fontWeight="semibold" color="gray.700">
                {view === "buy"
                  ? thread?.seller?.username
                  : thread?.buyer?.username}
              </Box>
            </Text>
          ) : (
            <HStack spacing={3}>
              {viewerIsBuyer &&
                !thread?.listing?.isDraft &&
                !thread?.listing?.isDeleted &&
                !thread?.listing?.isSold &&
                !thread?.listing?.buyer && (
                  <Button
                    as={RouterLink}
                    to={`/checkout/${thread?.listing?._id}`}
                    size="xs"
                    bg="gray.100"
                    color="black"
                    _hover={{ bg: "gray.300" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Buy Now for {formatCurrency(String(buyNowPrice || 0))}
                  </Button>
                )}

              {canShowOfferButton && (
                <Button
                  size="xs"
                  border="1px solid"
                  borderColor="gray.300"
                  bg="white"
                  color="black"
                  _hover={{ bg: "gray.100" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (viewerIsBuyer) onOfferOpen();
                    if (viewerIsSeller) onSellerOfferOpen();
                  }}
                >
                  {viewerIsBuyer ? "Offer" : "Send Private Offer"}
                </Button>
              )}
            </HStack>
          )}
        </Box>
      </HStack>

      {expanded && (
        <Box px={6} py={4} onClick={(e) => e.stopPropagation()}>
          {showArchivedBanner && (
            <Box
              w="100%"
              bg="gray.100"
              borderTop="1px solid"
              borderBottom="1px solid"
              borderColor="gray.200"
              py={3}
              textAlign="center"
              mb={3}
            >
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {archivedBannerText}
              </Text>
            </Box>
          )}

          {hasMore && (
            <Button
              size="xs"
              variant="ghost"
              mb={3}
              onClick={loadOlder}
              isDisabled={loading}
            >
              Show older messages
            </Button>
          )}

          <Box
            ref={scrollerRef}
            maxH="420px"
            overflowY="auto"
            pr={2}
            pb={3}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            {loading && !items.length ? (
              <Flex w="full" h="200px" align="center" justify="center">
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Flex>
            ) : items.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <VStack align="stretch" spacing={3}>
                  {items.map((m, idx) => {
                    const prev = items[idx - 1];
                    const sameGroup =
                      prev &&
                      String(getOwnerId(prev)) === String(getOwnerId(m)) &&
                      Math.abs(
                        new Date(m.createdAt) - new Date(prev.createdAt)
                      ) /
                        1000 <
                        60;

                    const isLastInGroup =
                      !items[idx + 1] ||
                      String(getOwnerId(items[idx + 1])) !==
                        String(getOwnerId(m)) ||
                      Math.abs(
                        new Date(items[idx + 1].createdAt) -
                          new Date(m.createdAt)
                      ) /
                        1000 >=
                        60;

                    const offerIsMine =
                      m.type === "offer" &&
                      String(m.sender?._id || m.sender) === String(userId);

                    const systemIsMine =
                      m.type === "system" &&
                      m.actor &&
                      String(m.actor?._id || m.actor) === String(userId);

                    const systemIsPlatform = m.type === "system" && !m.actor;

                    let alignment;

                    if (m.type === "offer") {
                      alignment = offerIsMine ? "end" : "start";
                    } else if (m.type === "system") {
                      if (systemIsPlatform) alignment = "start";
                      else alignment = systemIsMine ? "end" : "start";
                    } else {
                      alignment =
                        String(m.sender?._id || m.sender) === String(userId)
                          ? "end"
                          : "start";
                    }

                    return (
                      <VStack
                        key={`${m._id}-${m.createdAt}`}
                        align={alignment}
                        w="full"
                        spacing={1}
                        py={1}
                      >
                        {!sameGroup && m.type === "text" && (
                          <Text fontSize="xs" color="gray.500">
                            {m.sender?.username || "Unknown"}
                          </Text>
                        )}

                        {m.type === "system" || m.type === "offer" ? (
                          <SystemMessage
                            message={m}
                            isMe={alignment === "end"}
                            onNewMessage={(msg, maybeOrder) => {
                              if (msg?.system?.event === "offer_accepted") {
                                handleSystemUpdate(msg, maybeOrder || null);
                              } else if (
                                msg?.system?.event === "order_created"
                              ) {
                                handleSystemUpdate(msg);
                              }
                            }}
                          />
                        ) : (
                          <Box
                            maxW="70%"
                            bg={alignment === "end" ? "black" : "gray.100"}
                            color={alignment === "end" ? "white" : "gray.800"}
                            px={3}
                            py={2}
                            borderRadius="lg"
                          >
                            <Text fontSize="sm" whiteSpace="pre-wrap">
                              {m.content}
                            </Text>
                          </Box>
                        )}

                        {isLastInGroup && (
                          <Text fontSize="xs" color="gray.500">
                            {fullDateTime(m.createdAt)}
                          </Text>
                        )}
                      </VStack>
                    );
                  })}
                </VStack>
              </motion.div>
            ) : (
              <Text fontSize="xs" color="gray.400">
                No messages yet
              </Text>
            )}
          </Box>

          <HStack mt={3} spacing={3}>
            <Input
              fontSize="sm"
              placeholder="Write a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="sm"
              onClick={handleSend}
              isLoading={sending}
              isDisabled={!draft.trim()}
            >
              Send
            </Button>
          </HStack>
        </Box>
      )}

      <OfferModal
        isOpen={isOfferOpen}
        onClose={onOfferClose}
        listing={thread.listing}
        mode="thread"
        onOfferCreated={() => {
          fetchInitial(true);
        }}
      />

      <SellerPrivateOfferModal
        isOpen={isSellerOfferOpen}
        onClose={onSellerOfferClose}
        listing={thread.listing}
        buyerId={thread.buyer?._id || thread.buyer}
        onOfferCreated={() => {
          fetchInitial(true);
        }}
      />
    </Box>
  );
}
