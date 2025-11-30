import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  HStack,
  Box,
  VStack,
  Input,
  Divider,
  Flex,
  Button,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

export default function SellerPrivateOfferModal({
  isOpen,
  onClose,
  listing,
  buyerId,
  onOfferCreated,
}) {
  const [offerPrice, setOfferPrice] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = useAuthStore((s) => s.token);

  const formatCurrency = (value) => {
    let number = value.replace(/[^\d]/g, "").slice(0, 6);
    if (number === "") return "";
    number = parseInt(number).toLocaleString();
    return `$${number}`;
  };

  const handleOfferPriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
    const formattedValue = formatCurrency(rawValue);
    setOfferPrice(formattedValue);
    setApiError("");

    const numeric = parseInt(rawValue);
    if (isNaN(numeric)) {
      setIsInvalid(false);
      setInlineError("");
      return;
    }

    if (numeric > listing.price) {
      setIsInvalid(true);
      setInlineError("Offer cannot exceed listing price");
    } else if (numeric <= 0) {
      setIsInvalid(true);
      setInlineError("Enter a valid amount");
    } else {
      setIsInvalid(false);
      setInlineError("");
    }
  };

  const handleClose = () => {
    setOfferPrice("");
    setIsInvalid(false);
    setInlineError("");
    setApiError("");
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    const numeric = parseInt(offerPrice.replace(/[^\d]/g, "")) || 0;

    if (isInvalid || numeric <= 0 || numeric > listing.price) {
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const payload = {
        buyerId,
        amount: numeric,
      };

      const res = await fetch(`/api/offers/${listing._id}/seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data?.error || data?.message || "Could not send offer");
        setSubmitting(false);
        return;
      }

      if (onOfferCreated) onOfferCreated();

      handleClose();
    } catch (err) {
      setApiError("Something went wrong");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setOfferPrice("");
      setIsInvalid(false);
      setInlineError("");
      setApiError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!listing) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={0} p={6} maxH="90vh">
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
          Send private offer
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody overflowY="auto">
          <HStack spacing={4} align="start">
            <Box bg="gray.200" w="70px" h="70px" boxShadow="sm">
              {listing.thumbnail && (
                <Image
                  src={listing.thumbnail}
                  alt={listing.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              )}
            </Box>

            <Box w="100%">
              <VStack align="start" spacing={2}>
                <HStack justifyContent="space-between" w="100%">
                  <Text fontSize="xs" color="gray.600">
                    {listing.designer}
                  </Text>
                  <Text fontSize="xs" fontWeight="bold" color="black">
                    ${listing.price}
                  </Text>
                </HStack>

                <Text fontSize="xs" color="gray.600">
                  {listing.title}
                </Text>

                <HStack justifyContent="space-between" w="100%">
                  <Text fontSize="xs" color="gray.600">
                    {listing.size}
                  </Text>
                  <Text fontSize="xs" fontWeight="bold" color="black">
                    ♡ {listing.favoritesCount}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </HStack>

          <Divider mt={4} mb={6} />

          <Flex justify="center">
            <Input
              minH={24}
              maxW="300px"
              textAlign="center"
              placeholder={`$${Math.floor(listing.price * 0.9)}`}
              variant="flushed"
              fontSize="5xl"
              fontWeight="bold"
              value={offerPrice}
              onChange={handleOfferPriceChange}
              borderColor={isInvalid ? "red.500" : "gray.300"}
              color={isInvalid ? "red.500" : "gray.500"}
              _focus={{ borderColor: isInvalid ? "red.500" : "gray.500" }}
              _placeholder={{ color: isInvalid ? "red.300" : "gray.400" }}
            />
          </Flex>

          <Text
            fontSize="xs"
            textAlign="center"
            mb={isInvalid ? 2 : 8}
            color={isInvalid ? "red.500" : "gray.500"}
            fontWeight={isInvalid ? "bold" : "normal"}
          >
            {isInvalid
              ? inlineError
              : "Buyer has 24 hours to accept this offer"}
          </Text>

          {apiError && (
            <Text
              fontSize="xs"
              color="red.500"
              textAlign="center"
              mb={4}
              fontWeight="semibold"
            >
              {apiError}
            </Text>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            w="100%"
            colorScheme="blackAlpha"
            color="white"
            bg="black"
            size="lg"
            borderRadius="none"
            py={5}
            onClick={handleSubmit}
            isLoading={submitting}
            disabled={submitting || isInvalid || offerPrice === ""}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
