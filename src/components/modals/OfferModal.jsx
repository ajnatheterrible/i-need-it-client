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
  Grid,
  Image,
  Icon,
  Heading,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { FaRegCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ShinyButton from "../ui/ShinyButton";
import AddressSelectModal from "../modals/AddressSelectModal";
import AddressModal from "../modals/AddressModal";
import useAuthStore from "../../store/authStore";
import useFetchAddresses from "../../hooks/useFetchAddresses";
import useFetchPaymentMethods from "../../hooks/useFetchPaymentMethods";
import { calculateTotal } from "../../utils/calculateOrder";

export default function OfferModal({
  isOpen,
  onClose,
  listing,
  mode = "listing",
  onOfferCreated,
}) {
  const [offerPrice, setOfferPrice] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCard, setSelectedCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [affirmLoaded, setAffirmLoaded] = useState(false);
  const [klarnaLoaded, setKlarnaLoaded] = useState(false);

  const { loading: addressesLoading } = useFetchAddresses();
  const { loading: paymentsLoading } = useFetchPaymentMethods();

  const token = useAuthStore((s) => s.token);
  const addresses = useAuthStore((s) => s.fetchedData?.addresses);
  const paymentMethods = useAuthStore((s) => s.fetchedData?.paymentMethods);

  const {
    isOpen: isSelectOpen,
    onOpen: openAddressSelect,
    onClose: closeAddressSelect,
  } = useDisclosure();
  const {
    isOpen: isAddressModalOpen,
    onOpen: openAddressModal,
    onClose: closeAddressModal,
  } = useDisclosure();

  const navigate = useNavigate();

  const formatCurrency = (value) => {
    let number = value.replace(/[^\d]/g, "").slice(0, 6);
    if (number === "") return "";
    number = parseInt(number).toLocaleString();
    return `$${number}`;
  };

  const formatCurrencyDisplay = (amount) => {
    if (isNaN(amount)) return "$0.00";
    return `$${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  };

  const handleOfferPriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
    const formattedValue = formatCurrency(rawValue);
    setOfferPrice(formattedValue);
    setErrorMessage("");
    const numericValue = parseInt(rawValue);
    if (isNaN(numericValue)) {
      setIsInvalid(false);
      setErrorMessage("");
      return;
    }
    const minAllowed = listing.price * 0.6;
    if (numericValue < minAllowed) {
      setIsInvalid(true);
      setErrorMessage(
        `Your offer is too low. Must be $${minAllowed.toFixed(0)} or higher`
      );
    } else if (numericValue > listing.price) {
      setIsInvalid(true);
      setErrorMessage("Offer cannot exceed listing price");
    } else {
      setIsInvalid(false);
      setErrorMessage("");
    }
  };

  const handleClose = () => {
    setOfferPrice("");
    setIsInvalid(false);
    setErrorMessage("");
    setStep(1);
    setSubmitting(false);
    onClose();
  };

  const handleNext = () => {
    if (!isInvalid && offerPrice !== "") setStep(2);
  };

  const handleBack = () => setStep(1);

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const defaultCard = paymentMethods.find((c) => c.isDefault);
      setSelectedCard(defaultCard || paymentMethods[0]);
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (addresses?.length && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const numericOffer = parseInt(offerPrice.replace(/[^\d]/g, "")) || 0;
  const { tax, shipping, total } = calculateTotal(numericOffer);

  const handleSubmitOffer = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setErrorMessage("");

      const numericOffer = parseInt(offerPrice.replace(/[^\d]/g, "")) || 0;
      const minAllowed = listing.price * 0.6;

      if (
        isInvalid ||
        numericOffer < minAllowed ||
        numericOffer > listing.price ||
        !selectedAddress ||
        paymentMethod !== "credit"
      ) {
        throw new Error("Please ensure your offer and address are valid.");
      }

      const payload = {
        listingId: listing._id,
        amount: numericOffer,
        shippingAddress: selectedAddress,
        tax,
        shipping,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const res = await fetch(`/api/offers/${listing._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 400
            ? "Invalid offer details."
            : "Failed to submit offer. Please try again.");
        throw new Error(msg);
      }

      handleClose();

      if (mode === "thread" && onOfferCreated) {
        onOfferCreated();
      } else {
        navigate("/messages");
      }
    } catch (err) {
      setErrorMessage(
        err.message?.includes("Insufficient funds")
          ? "You don’t have enough store credit to place this offer."
          : err.message || "Something went wrong. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={step === 1 ? "xl" : "5xl"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius={0} p={6} maxH="90vh">
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" mb={3}>
          Send offer
        </ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody overflowY="auto">
          {step === 1 ? (
            <>
              <HStack spacing={4} align="start">
                <Box bg="gray.200" w="70px" h="70px" boxShadow="sm">
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
                <Box w="100%">
                  <VStack align="start" spacing={2}>
                    <HStack justifyContent="space-between" w="100%">
                      <Text fontSize="xs" color="gray.600">
                        {listing?.designer}
                      </Text>
                      <Text fontSize="xs" fontWeight="bold" color="black">
                        ${listing?.price}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      {listing?.title}
                    </Text>
                    <HStack justifyContent="space-between" w="100%">
                      <Text fontSize="xs" color="gray.600">
                        {listing?.size}
                      </Text>
                      <Text fontSize="xs" fontWeight="bold" color="black">
                        ♡ {listing?.favoritesCount}
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
                  placeholder={`$${Math.floor(listing?.price * 0.9)}`}
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
                mb={errorMessage ? 2 : 8}
                color={isInvalid ? "red.500" : "gray.500"}
                fontWeight={isInvalid ? "bold" : "normal"}
              >
                {isInvalid
                  ? errorMessage
                  : "Shipping and taxes calculated in the next step"}
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                The seller has 24 hours to accept this offer
              </Text>
            </>
          ) : (
            <Grid templateColumns="repeat(12, 1fr)" gap={8}>
              <Box gridColumn="span 7">
                <VStack spacing={8} align="start">
                  <Box
                    w="100%"
                    onClick={
                      addresses?.length > 0
                        ? openAddressSelect
                        : openAddressModal
                    }
                  >
                    <Text fontWeight="bold" mb={2}>
                      Shipping address
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      p={4}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      _hover={{ cursor: "pointer" }}
                    >
                      {addresses?.length > 0 ? (
                        <VStack spacing={1} align="start">
                          <Text fontSize="sm" fontWeight="semibold">
                            {selectedAddress?.fullName ||
                              addresses[0]?.fullName}
                          </Text>
                          <Text fontSize="sm">
                            {selectedAddress?.line1 || addresses[0]?.line1}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {selectedAddress?.city || addresses[0]?.city},{" "}
                            {selectedAddress?.state || addresses[0]?.state}{" "}
                            {selectedAddress?.zip || addresses[0]?.zip}
                          </Text>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">
                          Add a new address
                        </Text>
                      )}
                      <ChevronRightIcon boxSize={5} />
                    </Box>
                  </Box>
                  <Box
                    w="100%"
                    onClick={
                      addresses?.length > 0
                        ? openAddressSelect
                        : openAddressModal
                    }
                  >
                    <Text fontWeight="bold" mb={2}>
                      Phone
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.200"
                      p={4}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                      _hover={{ cursor: "pointer" }}
                    >
                      {selectedAddress?.phone || addresses?.[0]?.phone ? (
                        <Text fontSize="sm" fontWeight="semibold">
                          +1{" "}
                          {formatPhoneNumber(
                            selectedAddress?.phone || addresses?.[0]?.phone
                          )}
                        </Text>
                      ) : (
                        <Flex align="center" justify="center" w="full">
                          <Text fontSize="sm" textAlign="center">
                            Add a phone number
                          </Text>
                        </Flex>
                      )}
                      <ChevronRightIcon boxSize={5} />
                    </Box>
                    <Text fontSize="xs" color="gray.600">
                      Required for international transactions. It will only be
                      used for delivery related issues
                    </Text>
                  </Box>
                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Select your payment method
                    </Text>
                    <HStack spacing={4} mb={4} w="100%">
                      <ShinyButton
                        isSelected={paymentMethod === "credit"}
                        onClick={() => setPaymentMethod("credit")}
                        w="100%"
                      >
                        Earned Credit
                      </ShinyButton>
                      <Button
                        variant="outline"
                        display="flex"
                        alignItems="center"
                        gap={2}
                        w="100%"
                        fontSize="xs"
                        fontWeight="normal"
                        borderColor={
                          paymentMethod === "card" ? "black" : undefined
                        }
                        borderWidth={
                          paymentMethod === "card" ? "1px" : undefined
                        }
                        onClick={() => setPaymentMethod("card")}
                      >
                        <Icon as={FaRegCreditCard} boxSize={4} mt="1px" />
                        Card
                      </Button>
                      <Button
                        variant="outline"
                        w="100%"
                        borderColor={
                          paymentMethod === "affirm" ? "black" : undefined
                        }
                        borderWidth={
                          paymentMethod === "affirm" ? "1px" : undefined
                        }
                        onClick={() => setPaymentMethod("affirm")}
                      >
                        <Skeleton
                          isLoaded={affirmLoaded}
                          fadeDuration={0.4}
                          w="100%"
                          display="flex"
                          justifyContent="center"
                        >
                          <Image
                            src="/assets/logos/affirm.png"
                            alt="Affirm Logo"
                            height="24px"
                            onLoad={() => setAffirmLoaded(true)}
                          />
                        </Skeleton>
                      </Button>
                      <Button
                        variant="outline"
                        w="100%"
                        borderColor={
                          paymentMethod === "klarna" ? "black" : undefined
                        }
                        borderWidth={
                          paymentMethod === "klarna" ? "1px" : undefined
                        }
                        onClick={() => setPaymentMethod("klarna")}
                      >
                        <Skeleton
                          isLoaded={klarnaLoaded}
                          fadeDuration={0.4}
                          w="100%"
                          display="flex"
                          justifyContent="center"
                        >
                          <Image
                            src="/assets/logos/klarna.png"
                            alt="Klarna Logo"
                            height="30px"
                            onLoad={() => setKlarnaLoaded(true)}
                          />
                        </Skeleton>
                      </Button>
                    </HStack>
                  </Box>
                  <Button variant="ghost" onClick={handleBack}>
                    ← Back
                  </Button>
                </VStack>
              </Box>
              <Box gridColumn="span 5">
                <VStack align="start" spacing={6} w="100%">
                  <Box
                    w="100%"
                    border="1px solid"
                    borderColor="gray.200"
                    p={4}
                    bg="white"
                  >
                    <HStack spacing={4}>
                      <Box w="90px" h="90px" bg="gray.100">
                        {listing?.thumbnail && (
                          <Image
                            src={listing.thumbnail}
                            alt={listing.title}
                            objectFit="cover"
                            w="100%"
                            h="100%"
                          />
                        )}
                      </Box>
                      <Box flex="1">
                        <Text fontSize="xs" fontWeight="bold" mb={2}>
                          {listing?.designer}
                        </Text>
                        <Text color="gray.600" fontSize="xs">
                          {listing?.title}
                        </Text>
                        <Text color="gray.600" fontSize="xs" mb={2}>
                          Size: {listing?.size}
                        </Text>
                        <Text fontSize="xs" fontWeight="bold">
                          Seller:{" "}
                          <Box as="span" fontWeight="medium">
                            {listing?.seller?.username}
                          </Box>
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <Box w="100%">
                    <Heading size="sm" mb={3}>
                      Order details
                    </Heading>
                    <VStack align="start" spacing={2} w="100%">
                      <HStack justify="space-between" w="100%" fontSize="xs">
                        <Text>Offer price</Text>
                        {paymentMethod === "credit" ? (
                          <HStack spacing={2}>
                            <Text as="s" color="gray.500">
                              {offerPrice || "$0"}
                            </Text>
                            <Text fontWeight="semibold">
                              {formatCurrencyDisplay(0)}
                            </Text>
                          </HStack>
                        ) : (
                          <Text>{offerPrice || "$0"}</Text>
                        )}
                      </HStack>

                      <HStack justify="space-between" w="100%" fontSize="xs">
                        <Text>Shipping</Text>
                        {paymentMethod === "credit" ? (
                          <HStack spacing={2}>
                            <Text as="s" color="gray.500">
                              {formatCurrencyDisplay(shipping)}
                            </Text>
                            <Text fontWeight="semibold">
                              {formatCurrencyDisplay(0)}
                            </Text>
                          </HStack>
                        ) : (
                          <Text>{formatCurrencyDisplay(shipping)}</Text>
                        )}
                      </HStack>

                      <HStack justify="space-between" w="100%" fontSize="xs">
                        <Text>
                          Estimated tax{" "}
                          <Tooltip
                            label="The final tax amount will be calculated if the seller accepts your offer"
                            fontSize="xs"
                            bg="black"
                            color="white"
                            borderRadius="sm"
                            px={3}
                            py={2}
                            placement="top"
                            hasArrow
                          >
                            <InfoIcon boxSize={3} ml={1} color="gray.500" />
                          </Tooltip>
                        </Text>
                        {paymentMethod === "credit" ? (
                          <HStack spacing={2}>
                            <Text as="s" color="gray.500">
                              {formatCurrencyDisplay(tax)}
                            </Text>
                            <Text fontWeight="semibold">
                              {formatCurrencyDisplay(0)}
                            </Text>
                          </HStack>
                        ) : (
                          <Text>{formatCurrencyDisplay(tax)}</Text>
                        )}
                      </HStack>
                    </VStack>
                  </Box>

                  <Divider />

                  <Box w="100%" mb={3}>
                    <HStack justify="space-between" w="100%">
                      <Heading size="sm">Order total</Heading>
                      {paymentMethod === "credit" ? (
                        <Heading size="sm">{formatCurrencyDisplay(0)}</Heading>
                      ) : (
                        <Heading size="sm">
                          {formatCurrencyDisplay(total)}
                        </Heading>
                      )}
                    </HStack>

                    {paymentMethod === "credit" && (
                      <Flex justify="flex-end" mt={4}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.500"
                        >
                          Covered by I Need It
                        </Text>
                      </Flex>
                    )}
                  </Box>

                  {errorMessage && (
                    <Text
                      w="100%"
                      color="red.500"
                      fontSize="sm"
                      textAlign="center"
                      fontWeight="semibold"
                      mb={2}
                    >
                      {errorMessage}
                    </Text>
                  )}

                  <Button
                    w="100%"
                    colorScheme="blackAlpha"
                    color="white"
                    bg="black"
                    size="lg"
                    borderRadius="none"
                    py={5}
                    onClick={handleSubmitOffer}
                    isLoading={submitting}
                    disabled={
                      submitting ||
                      paymentMethod !== "credit" ||
                      isInvalid ||
                      numericOffer < listing.price * 0.6 ||
                      numericOffer > listing.price ||
                      !selectedAddress
                    }
                  >
                    Submit Offer
                  </Button>

                  <Box w="100%">
                    <HStack align="start">
                      <Box
                        as="svg"
                        width="5"
                        height="5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="gray.500"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        By tapping Submit Offer, your funds will be held until
                        the seller responds or until your offer expires
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </Grid>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          {step === 1 && (
            <Button
              colorScheme="blackAlpha"
              color="white"
              bg="black"
              size="lg"
              borderRadius="none"
              py={5}
              onClick={handleNext}
              disabled={isInvalid || offerPrice === ""}
              w="100%"
            >
              Next
            </Button>
          )}
        </ModalFooter>
      </ModalContent>

      <AddressSelectModal
        isOpen={isSelectOpen}
        onClose={closeAddressSelect}
        onSelect={setSelectedAddress}
        addresses={addresses}
        onAddNewAddress={openAddressModal}
      />
      <AddressModal isOpen={isAddressModalOpen} onClose={closeAddressModal} />
    </Modal>
  );
}
