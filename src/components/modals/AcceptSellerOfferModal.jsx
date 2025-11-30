import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  Button,
  Image,
  Flex,
  Icon,
  Tooltip,
  useDisclosure,
  Grid,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { FaRegCreditCard, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useState, useEffect } from "react";

import ShinyButton from "../ui/ShinyButton";
import AddressSelectModal from "./AddressSelectModal";
import CardSelectModal from "./CardSelectModal";
import AddressModal from "./AddressModal";

import useAuthStore from "../../store/authStore";
import useFetchAddresses from "../../hooks/useFetchAddresses";
import useFetchPaymentMethods from "../../hooks/useFetchPaymentMethods";
import { calculateTotal } from "../../utils/calculateOrder";

export default function AcceptSellerOfferModal({
  isOpen,
  onClose,
  offer,
  listing,
  onSuccess,
}) {
  const token = useAuthStore((s) => s.token);
  const addresses = useAuthStore((s) => s.fetchedData?.addresses);
  const paymentMethods = useAuthStore((s) => s.fetchedData?.paymentMethods);

  const { loading: addressesLoading } = useFetchAddresses();
  const { loading: paymentsLoading } = useFetchPaymentMethods();

  const {
    isOpen: isAddrSelectOpen,
    onOpen: openAddrSelect,
    onClose: closeAddrSelect,
  } = useDisclosure();

  const {
    isOpen: isCardSelectOpen,
    onOpen: openCardSelect,
    onClose: closeCardSelect,
  } = useDisclosure();

  const {
    isOpen: isAddressModalOpen,
    onOpen: openAddressModal,
    onClose: closeAddressModal,
  } = useDisclosure();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [affirmLoaded, setAffirmLoaded] = useState(false);
  const [klarnaLoaded, setKlarnaLoaded] = useState(false);

  const offerPrice =
    offer?.amount != null
      ? Number(offer.amount)
      : offer?.amount_cents != null
      ? offer.amount_cents / 100
      : 0;

  const { tax, shipping, total } = calculateTotal(offerPrice);

  useEffect(() => {
    if (!addressesLoading && addresses?.length > 0) {
      const def = addresses.find((a) => a.isDefaultPurchase);
      setSelectedAddress(def || addresses[0]);
    }
  }, [addressesLoading, addresses]);

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const def = paymentMethods.find((c) => c.isDefault);
      setSelectedCard(def || paymentMethods[0]);
    }
  }, [paymentMethods]);

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

  const handleAccept = async () => {
    if (!token || !selectedAddress || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/offers/${offer._id}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: selectedAddress,
          paymentMethod,
          cardId: selectedCard?._id || null,
          tax,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isBusy =
    loading || addressesLoading || paymentsLoading || !offer || !listing;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={0} p={6} maxH="90vh">
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            mb={3}
          >
            Accept offer
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody overflowY="auto">
            {isBusy && !addresses?.length ? (
              <Flex justify="center" py={10}>
                <Text fontSize="sm" color="gray.500">
                  Loading…
                </Text>
              </Flex>
            ) : (
              <Grid templateColumns="repeat(12, 1fr)" gap={8}>
                <Box gridColumn="span 7">
                  <VStack spacing={8} align="start">
                    <Box
                      w="100%"
                      onClick={
                        addresses?.length ? openAddrSelect : openAddressModal
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
                        {selectedAddress ? (
                          <VStack spacing={1} align="start">
                            <Text fontSize="sm" fontWeight="semibold">
                              {selectedAddress.fullName}
                            </Text>
                            <Text fontSize="sm">{selectedAddress.line1}</Text>
                            {selectedAddress.line2 && (
                              <Text fontSize="sm">{selectedAddress.line2}</Text>
                            )}
                            <Text fontSize="xs" color="gray.600">
                              {selectedAddress.city}, {selectedAddress.state}{" "}
                              {selectedAddress.zip}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {selectedAddress.country}
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
                        addresses?.length ? openAddrSelect : openAddressModal
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
                        {selectedAddress?.phone ? (
                          <Text fontSize="sm" fontWeight="semibold">
                            +1 {formatPhoneNumber(selectedAddress.phone)}
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

                      {paymentMethod === "card" && selectedCard && (
                        <Box
                          border="1px solid"
                          borderColor="gray.200"
                          mt={4}
                          p={4}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          onClick={openCardSelect}
                          _hover={{ cursor: "pointer", bg: "gray.50" }}
                        >
                          <HStack spacing={6} align="start">
                            <Icon
                              as={
                                selectedCard.cardType === "Visa"
                                  ? FaCcVisa
                                  : FaCcMastercard
                              }
                              boxSize={6}
                              color="gray.700"
                            />
                            <VStack spacing={1} align="start">
                              <Text fontSize="sm" fontWeight="semibold">
                                Ending in {selectedCard.last4}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                Exp. {selectedCard.expMonth} /{" "}
                                {selectedCard.expYear}
                              </Text>
                            </VStack>
                          </HStack>
                          <ChevronRightIcon boxSize={5} />
                        </Box>
                      )}
                    </Box>
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
                                {formatCurrencyDisplay(offerPrice)}
                              </Text>
                              <Text fontWeight="semibold">
                                {formatCurrencyDisplay(0)}
                              </Text>
                            </HStack>
                          ) : (
                            <Text>{formatCurrencyDisplay(offerPrice)}</Text>
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
                              label="The final tax amount will be calculated at purchase"
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
                          <Heading size="sm">
                            {formatCurrencyDisplay(0)}
                          </Heading>
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

                    <Button
                      w="100%"
                      colorScheme="blackAlpha"
                      color="white"
                      bg="black"
                      size="lg"
                      borderRadius="none"
                      py={5}
                      onClick={handleAccept}
                      isLoading={loading}
                      isDisabled={
                        loading ||
                        isBusy ||
                        !selectedAddress ||
                        paymentMethod !== "credit"
                      }
                    >
                      Confirm Purchase
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
                          By tapping Confirm Purchase, your earned credit will
                          be used if the offer can be fulfilled.
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </Grid>
            )}
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>

      <AddressSelectModal
        isOpen={isAddrSelectOpen}
        onClose={closeAddrSelect}
        addresses={addresses}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          closeAddrSelect();
        }}
        onAddNewAddress={openAddressModal}
      />

      <CardSelectModal
        isOpen={isCardSelectOpen}
        onClose={closeCardSelect}
        cards={paymentMethods}
        onSelect={(card) => {
          setSelectedCard(card);
          closeCardSelect();
        }}
      />

      <AddressModal isOpen={isAddressModalOpen} onClose={closeAddressModal} />
    </>
  );
}
