import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  HStack,
  Box,
  Image,
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

export default function BroadcastOfferModal({ isOpen, onClose, listing }) {
  const [offerPrice, setOfferPrice] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [broadcastsRemaining, setBroadcastsRemaining] = useState(null);
  const [lastWave, setLastWave] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const token = useAuthStore((s) => s.token);
  const toast = useToast();

  const price = Number(listing?.price || 0);
  const likersCount = Number(listing?.favoritesCount || 0);
  const listingMax = Math.floor(price * 0.9);

  useEffect(() => {
    if (!isOpen || !listing?._id) return;

    const fetchStatus = async () => {
      try {
        setLoadingStatus(true);
        const res = await fetch(`/api/offers/${listing._id}/broadcast/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setBroadcastsRemaining(data.broadcastsRemaining);
          setLastWave(data.lastWavePrice || null);
          setIsInvalid(false);
          setErrorMessage("");
        } else {
          setIsInvalid(true);
          setErrorMessage(data.message || "Unable to load broadcast status");
        }
      } catch {
        setIsInvalid(true);
        setErrorMessage("Unable to load broadcast status. Please try again.");
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatus();
  }, [isOpen, listing?._id, token]);

  const formatCurrency = (value) => {
    const num = value.replace(/[^\d]/g, "").slice(0, 6);
    if (!num) return "";
    return `$${parseInt(num, 10).toLocaleString()}`;
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const formatted = formatCurrency(raw);

    setOfferPrice(formatted);
    setIsInvalid(false);
    setErrorMessage("");

    if (!raw) return;

    const numeric = parseInt(raw, 10);

    if (numeric < 1) {
      setIsInvalid(true);
      setErrorMessage("Offer must be at least $1");
      return;
    }

    if (broadcastsRemaining === 3) {
      if (numeric > listingMax) {
        setIsInvalid(true);
        setErrorMessage(
          `Your first broadcast offer must be $${listingMax.toLocaleString()} or less (10% off listing price)`
        );
      }
    } else if (lastWave) {
      const requiredMax = Math.floor(lastWave * 0.9);
      if (numeric * 100 > requiredMax) {
        setIsInvalid(true);
        setErrorMessage(
          `Your next broadcast offer must be at least 10% below your last broadcast. Maximum: $${(
            requiredMax / 100
          ).toLocaleString()}.`
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (isInvalid || !offerPrice) return;

    const numeric = parseInt(offerPrice.replace(/[^\d]/g, "") || "0", 10);

    if (numeric < 1) {
      setIsInvalid(true);
      setErrorMessage("Offer must be at least $.");
      return;
    }

    try {
      setSubmitting(true);
      setIsInvalid(false);
      setErrorMessage("");

      const res = await fetch(`/api/offers/${listing._id}/broadcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numeric }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsInvalid(true);
        setErrorMessage(
          data?.message || "We couldn’t send this broadcast offer"
        );
        setSubmitting(false);
        return;
      }

      setBroadcastsRemaining(data.broadcastsRemaining);

      if (data.count === 0) {
        setIsInvalid(true);
        setErrorMessage("No one has favorited this item yet");
        setSubmitting(false);
        return;
      }

      setSubmitting(false);

      toast({
        title: "Broadcast sent",
        description: `Offer sent to ${data.count} interested ${
          data.count === 1 ? "buyer" : "buyers"
        }`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      handleClose();
    } catch {
      setIsInvalid(true);
      setErrorMessage(
        "We couldn’t send this broadcast offer. Please try again."
      );
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOfferPrice("");
    setErrorMessage("");
    setIsInvalid(false);
    setBroadcastsRemaining(null);
    setLastWave(null);
    onClose();
  };

  const canSend =
    !submitting &&
    !isInvalid &&
    !!offerPrice &&
    likersCount > 0 &&
    broadcastsRemaining !== 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent borderRadius={0} p={8}>
        <ModalHeader textAlign="center" fontWeight="bold" fontSize="xl" mb={2}>
          Send Offer to Interested Buyers
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {loadingStatus ? (
            <Flex justify="center" align="center" py={10}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <>
              <HStack spacing={4} align="start" mb={4}>
                <Box bg="gray.100" w="70px" h="70px">
                  {listing?.thumbnail && (
                    <Image
                      src={listing.thumbnail}
                      alt={listing.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                  )}
                </Box>
                <Box flex="1" minW={0}>
                  <Text fontWeight="semibold" fontSize="sm">
                    {listing?.designer}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {listing?.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {listing?.size} • ${price.toLocaleString()}
                  </Text>
                </Box>
              </HStack>

              <Flex direction="column" align="center" mb={2}>
                <Input
                  variant="unstyled"
                  textAlign="center"
                  placeholder={`$${listingMax.toLocaleString()}`}
                  fontSize="5xl"
                  fontWeight="bold"
                  value={offerPrice}
                  onChange={handleChange}
                  color={isInvalid ? "red.500" : "gray.800"}
                  _focus={{ outline: "none" }}
                  maxW="260px"
                  mb={1}
                />
                <Box
                  borderBottom="1px solid"
                  borderColor={isInvalid ? "red.400" : "gray.300"}
                  w="300px"
                  mb={3}
                />
                {errorMessage && (
                  <Text
                    color="red.500"
                    fontSize="xs"
                    textAlign="center"
                    fontWeight="semibold"
                    mb={3}
                  >
                    {errorMessage}
                  </Text>
                )}
                <Text fontSize="xs" textAlign="center" color="gray.500" mb={5}>
                  Excludes shipping and tax
                </Text>
              </Flex>
            </>
          )}
        </ModalBody>

        {!loadingStatus && (
          <ModalFooter flexDir="column">
            {broadcastsRemaining !== null && (
              <Text
                fontSize="xs"
                color={broadcastsRemaining === 0 ? "red.500" : "gray.600"}
                textAlign="center"
                mb={3}
                fontWeight="semibold"
              >
                {broadcastsRemaining === 0
                  ? "You’ve used all 3 broadcast offers for this listing"
                  : `${broadcastsRemaining} broadcast offer${
                      broadcastsRemaining === 1 ? "" : "s"
                    } remaining`}
              </Text>
            )}
            <Text
              fontSize="xs"
              color="gray.500"
              textAlign="center"
              mb={3}
              fontWeight="medium"
            >
              {likersCount === 0
                ? "No users have favorited this item yet"
                : `${likersCount} buyer${
                    likersCount === 1 ? "" : "s"
                  } will receive this offer`}
            </Text>

            <Button
              w="100%"
              bg="black"
              color="white"
              borderRadius="none"
              py={5}
              fontWeight="semibold"
              onClick={handleSubmit}
              isLoading={submitting}
              disabled={!canSend}
            >
              Send Offer
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
