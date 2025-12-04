import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";

export default function PriceDropModal({
  isOpen,
  onClose,
  listing,
  currentPrice,
  onSubmit,
}) {
  const toast = useToast();

  const [selectedDiscount, setSelectedDiscount] = useState(20);
  const [priceInput, setPriceInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const safePrice = typeof currentPrice === "number" ? currentPrice : 0;

  const applyDiscount = (pct) => {
    if (!safePrice) return "";
    const discounted = Math.max(1, Math.round(safePrice * (1 - pct / 100)));
    return discounted.toString();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedDiscount(20);
      setPriceInput(applyDiscount(20));
      setSubmitting(false);
      setErrorMessage("");
    }
  }, [isOpen, currentPrice]);

  const parsedPrice = (() => {
    const n = parseFloat(priceInput.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return 0;
    return Math.round(n * 100) / 100;
  })();

  const isPriceValid =
    safePrice > 0 && parsedPrice > 0 && parsedPrice < safePrice;

  const canSubmit = !submitting && isPriceValid;

  const handleSelectDiscount = (pct) => {
    setSelectedDiscount(pct);
    const value = applyDiscount(pct);
    if (value) setPriceInput(value);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) return;

    const payload = {
      newPrice: parsedPrice,
      discountPercent: selectedDiscount,
    };

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await onSubmit(payload);

      const success =
        result === undefined ||
        (typeof result === "object" ? result.success !== false : true);

      if (!success) {
        const msg =
          (result && result.error) ||
          "Something went wrong while updating the price";
        setErrorMessage(msg);
        return;
      }

      toast({
        title: "Price updated",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while updating the price";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const discountOptions = [
    { pct: 10, label: "↓ 10%" },
    { pct: 20, label: "↓ 20%" },
    { pct: 30, label: "↓ 30%" },
  ];

  const buttonLabel = isPriceValid
    ? `Price drop to $${parsedPrice.toFixed(0)}`
    : "Set a lower price";

  const originalPrice =
    typeof listing?.originalPrice === "number"
      ? listing.originalPrice
      : safePrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="0">
        <ModalCloseButton />
        <ModalBody pt={10} pb={8} px={10}>
          <VStack align="stretch" spacing={6}>
            <Text fontSize="lg" fontWeight="semibold" textAlign="center">
              Price Drop
            </Text>

            <HStack align="flex-start" justify="space-between" spacing={4}>
              <Box w="72px" h="96px" flexShrink={0} bg="gray.100">
                <Image
                  src={
                    listing?.thumbnail ||
                    listing?.imageUrl ||
                    "https://via.placeholder.com/72x96"
                  }
                  alt={listing?.title || "Listing"}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>

              <VStack align="flex-start" spacing={1} flex="1">
                <Text fontSize="sm" fontWeight="semibold">
                  {listing?.designer || ""}
                </Text>
                <Text fontSize="sm" noOfLines={2}>
                  {listing?.title || ""}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {listing?.size || ""}
                </Text>
              </VStack>

              <VStack align="flex-end" spacing={1} minW="80px">
                <Text fontSize="sm" fontWeight="semibold" color="red.500">
                  ${safePrice.toFixed(0)}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.400"
                  textDecoration={
                    originalPrice && originalPrice > safePrice
                      ? "line-through"
                      : "none"
                  }
                >
                  {originalPrice && originalPrice > safePrice
                    ? `$${originalPrice.toFixed(0)}`
                    : ""}
                </Text>
                {typeof listing?.favoritesCount === "number" && (
                  <HStack spacing={1} fontSize="xs" color="gray.500">
                    <FiHeart />
                    <Text>{listing.favoritesCount}</Text>
                  </HStack>
                )}
              </VStack>
            </HStack>

            <Box borderWidth="1px" borderColor="gray.200">
              <HStack spacing={0} w="100%">
                {discountOptions.map((opt) => {
                  const isActive = selectedDiscount === opt.pct;
                  return (
                    <Box
                      key={opt.pct}
                      flex="1"
                      textAlign="center"
                      py={4}
                      cursor="pointer"
                      bg={isActive ? "black" : "white"}
                      color={isActive ? "white" : "gray.800"}
                      borderRightWidth={opt.pct !== 30 ? "1px" : "0"}
                      borderColor="gray.200"
                      onClick={() => handleSelectDiscount(opt.pct)}
                    >
                      <VStack spacing={1}>
                        <Text fontSize="xs">{opt.label}</Text>
                        <Text fontSize="sm" fontWeight="semibold">
                          ${applyDiscount(opt.pct) || safePrice.toFixed(0)}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </HStack>
            </Box>

            <Box borderWidth="1px" borderColor="gray.200">
              <HStack spacing={0}>
                <Box
                  w="80px"
                  px={4}
                  py={3}
                  borderRightWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="sm" color="gray.600">
                    To
                  </Text>
                </Box>
                <Box flex="1" px={4} py={2}>
                  <Input
                    borderRadius="0"
                    variant="unstyled"
                    placeholder="Set a new price for your item"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                  />
                </Box>
              </HStack>
            </Box>

            {errorMessage && (
              <Text fontSize="xs" color="red.500">
                {errorMessage}
              </Text>
            )}

            <Button
              mt={2}
              w="100%"
              borderRadius="0"
              colorScheme="blackAlpha"
              isDisabled={!canSubmit}
              isLoading={submitting}
              onClick={handleSubmit}
            >
              {buttonLabel}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
