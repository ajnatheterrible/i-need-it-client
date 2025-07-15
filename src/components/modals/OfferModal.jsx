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
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function OfferModal({ isOpen, onClose }) {
  const [offerPrice, setOfferPrice] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  const MIN_OFFER = 25;
  const MAX_OFFER = 200000;

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

    const numericValue = parseInt(rawValue);

    if (isNaN(numericValue)) {
      setIsInvalid(false);
      setErrorMessage("");
      return;
    }

    if (numericValue < MIN_OFFER) {
      setIsInvalid(true);
      setErrorMessage("Your offer is too low. Must be $25 or higher");
    } else if (numericValue > MAX_OFFER) {
      setIsInvalid(true);
      setErrorMessage("Offers must be $200,000 or lower");
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
    onClose();
  };

  const handleNext = () => {
    if (!isInvalid && offerPrice !== "") {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
        maxWidth={step === 2 ? "6xl" : "600px"}
        m="auto"
        p={4}
        boxShadow="sm"
        borderRadius={0}
      >
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" mb={3}>
          {step === 1
            ? "Step 1 of 2: Make an Offer"
            : "Step 2 of 2: Review Offer"}
        </ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          {step === 1 ? (
            <>
              <HStack spacing={4} align="start">
                <Box bg="gray.200" w="70px" h="70px" boxShadow="sm" />
                <Box w="100%">
                  <VStack align="start" spacing={2}>
                    <HStack justifyContent="space-between" w="100%">
                      <Text fontSize="xs" color="gray.600">
                        Avant Garde × Japanese Brand × Yohji Yamamoto
                      </Text>
                      <Text fontSize="xs" fontWeight="bold" color="black">
                        $80
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      Vintage Lava Blazer Kmrii 14th Addiction Style
                    </Text>
                    <HStack justifyContent="space-between" w="100%">
                      <Text fontSize="xs" color="gray.600">
                        40R
                      </Text>
                      <Text fontSize="xs" fontWeight="bold" color="black">
                        ♡ 12
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </HStack>
              <Divider mt={4} mb={6} />
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="gray.600"
                textAlign="center"
              >
                Offer Price
              </Text>
              <Flex justify="center">
                <Input
                  minH={24}
                  maxW="300px"
                  textAlign="center"
                  placeholder="$72"
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
                  : "Shipping and taxes calculated in the next step."}
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                The seller has 24 hours to accept this offer.
              </Text>
            </>
          ) : (
            <Stack direction={{ base: "column", md: "row" }} spacing={10}>
              <VStack align="start" flex={1} spacing={6}>
                <Box>
                  <Text fontWeight="bold">Shipping Address</Text>
                  <Text mt={1}>Joey Pereira</Text>
                  <Text>2445 NW 158th St</Text>
                  <Text>Opa Locka, FL 33054</Text>
                  <Text>United States</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Phone</Text>
                  <Text mt={1}>+1 863 582 6881</Text>
                  <Text fontSize="xs" color="gray.500">
                    Required for international transactions. It will only be
                    used for delivery related issues.
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Select Your Payment Method</Text>
                  <Box
                    mt={3}
                    border="1px solid"
                    borderColor="gray.300"
                    p={3}
                    borderRadius="md"
                  >
                    <Text>💳 Card</Text>
                  </Box>
                  <Box
                    mt={3}
                    border="1px solid"
                    borderColor="gray.300"
                    p={3}
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">Ending in 0699</Text>
                    <Text fontSize="sm">Exp. 11/26</Text>
                  </Box>
                </Box>
                {step === 2 && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    fontSize="sm"
                    fontWeight="bold"
                    mt={16}
                  >
                    ← Back
                  </Button>
                )}
              </VStack>
              <VStack align="start" flex={1} spacing={4}>
                <HStack>
                  <Box bg="gray.200" w="60px" h="60px" />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Avant Garde × Japanese Brand × Yohji Yamamoto
                    </Text>
                    <Text fontSize="sm">
                      Vintage Lava Blazer Kmrii 14th Addiction Style
                    </Text>
                    <Text fontSize="sm">Size: 40R</Text>
                    <Text fontSize="sm">
                      Seller:{" "}
                      <Text as="span" fontWeight="bold">
                        Xyu
                      </Text>
                    </Text>
                  </Box>
                </HStack>
                <Box
                  p={3}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text fontSize="sm">
                    Item is final sale. You are responsible for any customs fees
                    or requests for personal information from the carrier.
                  </Text>
                </Box>
                <Box w="100%">
                  <Text fontWeight="bold" mb={2}>
                    Offer Details
                  </Text>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Offer Price</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      $89
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Shipping</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      $15
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Estimated Tax</Text>
                    <Text fontSize="sm" fontWeight="bold">
                      $7.28
                    </Text>
                  </HStack>
                  <Divider my={2} />
                  <HStack justify="space-between">
                    <Text fontWeight="bold">OFFER TOTAL</Text>
                    <Text fontWeight="bold">$111.28</Text>
                  </HStack>
                  <Button
                    mt={4}
                    width="100%"
                    bg="black"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                    py={5}
                    onClick={handleSubmit}
                    _hover={{ bg: "gray.800" }}
                  >
                    SUBMIT OFFER
                  </Button>
                </Box>
                <Box fontSize="xs" color="gray.600">
                  <Text fontWeight="bold" mb={1}>
                    🛡 I Need It Purchase Protection
                  </Text>
                  <Text>
                    This offer is binding and expires after 24 hours. If the
                    seller accepts this offer, your payment will be processed.
                    Buy with confidence. Qualifying orders are covered by our
                    Purchase Protection in the rare case something goes wrong.
                  </Text>
                  <Text mt={2}>
                    By proceeding, you are agreeing to the Terms of Service,
                    including our Returns / Purchase Protection policy.
                  </Text>
                  <Text mt={2}>
                    <Text as="span" fontWeight="bold">
                      Taxes & Tariffs
                    </Text>
                    : Learn more about taxes and eligibility.
                  </Text>
                </Box>
              </VStack>
            </Stack>
          )}
        </ModalBody>

        <ModalFooter justifyContent="center" p={4}>
          {step === 1 && (
            <Button
              colorScheme="gray"
              onClick={handleNext}
              width="100%"
              borderRadius={0}
              fontSize="sm"
              fontWeight="bold"
              py={5}
              bg="gray.300"
              _hover={{ bg: "gray.400" }}
              isDisabled={isInvalid || offerPrice === ""}
            >
              REVIEW OFFER
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
