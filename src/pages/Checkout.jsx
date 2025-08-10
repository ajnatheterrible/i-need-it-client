import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  Button,
  RadioGroup,
  Radio,
  Image,
  Flex,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";

import { FaBoxOpen, FaTruck, FaBolt } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { PuffLoader } from "react-spinners";

import Container from "../components/shared/Container";
import AddressSelectModal from "../components/modals/AddressSelectModal";
import AddressModal from "../components/modals/AddressModal";
import KlarnaSvg from "../../public/assets/logos/KlarnaSvg";
import AffirmSvg from "../../public/assets/logos/AffirmSvg";

import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";

import useAuthStore from "../store/authStore";
import useFetchAddresses from "../hooks/useFetchAddresses";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAddressModalOpen,
    onOpen: openAddressModal,
    onClose: closeAddressModal,
  } = useDisclosure();

  const { loading: addressesLoading } = useFetchAddresses();
  const addresses = useAuthStore((s) => s.fetchedData?.addresses);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  };

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Listing not found");
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const setDefaultAddress = () => {
      if (!addressesLoading && addresses?.length > 0) {
        const address = addresses.find((a) => a.isDefaultPurchase);
        setSelectedAddress(address);
      }
    };

    fetchListing();
    setDefaultAddress();
  }, [id, addressesLoading, addresses]);

  if (isLoading || addressesLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        w="full"
      >
        <PuffLoader size={60} color="#666" />
      </Box>
    );
  }

  return (
    <>
      <Container>
        <HStack justify="space-between" align="center" mt={6} mb={6}>
          <Box
            as={RouterLink}
            to="/"
            fontWeight="bold"
            fontSize="xl"
            letterSpacing="wide"
          >
            I NEED IT
          </Box>
          <Heading fontSize="2xl" fontWeight="bold" textAlign="center" flex="1">
            Item checkout
          </Heading>
        </HStack>
      </Container>

      <Divider />

      <Container
        isCheckout
        rightPane={
          <VStack spacing={6} align="start" w="100%" mt={14}>
            <Box
              w="100%"
              border="1px solid"
              borderColor="gray.200"
              p={4}
              bg="white"
            >
              <HStack spacing={4}>
                <Box w="90px" h="90px" bg="gray.100">
                  <Image
                    src={listing?.thumbnail}
                    alt="Item"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
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
                  <Text>Listing price</Text>
                  <Text>${listing?.price}</Text>
                </HStack>
                <HStack justify="space-between" w="100%" fontSize="xs">
                  <Text>Shipping</Text>
                  <Text>$24</Text>
                </HStack>
                <HStack justify="space-between" w="100%" fontSize="xs">
                  <Text>
                    Estimated tax{" "}
                    <Tooltip
                      label="I Need It is required to collect taxes on certain purchases. The final tax amount will be calculated at the time of purchase."
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
                  <Text>$96.18</Text>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            <Box w="100%" mb={3}>
              <HStack justify="space-between" w="100%">
                <Heading size="sm">Order total</Heading>
                <Heading size="sm">$1,470.18</Heading>
              </HStack>
            </Box>

            {paymentMethod === "card" && (
              <Button
                w="100%"
                colorScheme="blackAlpha"
                color="white"
                bg="black"
                size="lg"
                borderRadius="none"
              >
                Confirm Purchase
              </Button>
            )}

            {paymentMethod === "klarna" && (
              <Button
                w="100%"
                colorScheme="blackAlpha"
                color="white"
                bg="black"
                size="lg"
                borderRadius="none"
              >
                <Text mr={2}>Continue With</Text>{" "}
                <KlarnaSvg height="20" color="white" />
              </Button>
            )}

            {paymentMethod === "affirm" && (
              <Button
                w="100%"
                colorScheme="blackAlpha"
                color="white"
                bg="black"
                size="lg"
                borderRadius="none"
              >
                <Text mr={2}>Checkout With</Text>{" "}
                <AffirmSvg height="20" color="white" />
              </Button>
            )}

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
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 
       11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 
       5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c
       -3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </Box>
                <Text fontWeight="bold" mb={2} fontSize="xs">
                  I Need It Purchase Protection
                </Text>
              </HStack>
              <Text fontSize="xs" mb={2} color="gray.500">
                Buy with confidence. Qualifying orders are covered by our
                Purchase Protection in the rare case something goes wrong.{" "}
                <Box as="span" textDecoration="underline" cursor="pointer">
                  Learn more.
                </Box>
              </Text>
              <Text fontSize="xs" color="gray.500">
                By proceeding, you are agreeing to the{" "}
                <Box as="span" textDecoration="underline" cursor="pointer">
                  Terms of Service
                </Box>
                , including our returns and I Need It Purchase Protection
                policies.
              </Text>
              <Text fontWeight="bold" fontSize="xs" mt={3}>
                Taxes & Tariffs
              </Text>
              <Text
                fontSize="xs"
                textDecoration="underline"
                cursor="pointer"
                color="gray.500"
              >
                Learn more about taxes and eligibility
              </Text>
            </Box>
          </VStack>
        }
      >
        <VStack spacing={10} align="start" mt={4}>
          <Box
            w="100%"
            onClick={addresses?.length > 0 ? onOpen : openAddressModal}
          >
            <Heading size="sm" mb={6}>
              Shipping address
            </Heading>
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
                <Box>
                  <Text fontSize="sm" fontWeight="semibold">
                    {selectedAddress?.fullName}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" mb={1}>
                    {selectedAddress?.line1}
                  </Text>
                  {selectedAddress?.line2 && (
                    <Text fontSize="sm">{selectedAddress.line2}</Text>
                  )}
                  <Text fontSize="xs" color="gray.600">
                    {selectedAddress?.city}, {selectedAddress?.state}{" "}
                    {selectedAddress?.zip}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {selectedAddress?.country}
                  </Text>
                </Box>
              ) : (
                <Flex align="center" justify="center" w="full">
                  <Text fontSize="sm" textAlign="center">
                    Add a new address
                  </Text>
                </Flex>
              )}

              <ChevronRightIcon boxSize={5} />
            </Box>
          </Box>

          <Box w="100%">
            <Heading size="sm" mb={6}>
              Phone
            </Heading>
            <Box
              border="1px solid"
              borderColor="gray.200"
              p={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              onClick={addresses?.length > 0 ? onOpen : openAddressModal}
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
              Required for international transactions. It will only be used for
              delivery related issues.
            </Text>
          </Box>

          <Box w="100%">
            <Heading size="sm" mb={6}>
              Select your payment method
            </Heading>
            <HStack spacing={4}>
              <Button
                variant="outline"
                display="flex"
                alignItems="center"
                gap={2}
                w="100%"
                fontSize="xs"
                fontWeight="normal"
                borderColor={paymentMethod === "card" ? "black" : undefined}
                borderWidth={paymentMethod === "card" ? "1px" : undefined}
                onClick={() => {
                  setPaymentMethod("card");
                }}
              >
                <Icon as={FaRegCreditCard} boxSize={4} mt="1px" />
                Card
              </Button>

              <Button
                variant="outline"
                w="100%"
                borderColor={paymentMethod === "affirm" ? "black" : undefined}
                borderWidth={paymentMethod === "affirm" ? "1px" : undefined}
                onClick={() => {
                  setPaymentMethod("affirm");
                }}
              >
                <Image
                  src="/assets/logos/affirm.png"
                  alt="Affirm Logo"
                  height="24px"
                />
              </Button>

              <Button
                variant="outline"
                w="100%"
                borderColor={paymentMethod === "klarna" ? "black" : undefined}
                borderWidth={paymentMethod === "klarna" ? "1px" : undefined}
                onClick={() => {
                  setPaymentMethod("klarna");
                }}
              >
                <Image
                  src="/assets/logos/klarna.png"
                  alt="Klarna Logo"
                  height="30px"
                />
              </Button>
            </HStack>

            {paymentMethod === "card" && (
              <Box
                border="1px solid"
                borderColor="gray.200"
                mt={6}
                p={4}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                _hover={{ cursor: "pointer" }}
              >
                <Box>
                  <HStack spacing={6} align="start">
                    <Image
                      src="/assets/logos/visa.png"
                      alt="Visa Logo"
                      height="10px"
                      mt={2}
                    />
                    <VStack spacing={1} align="start">
                      <Text fontSize="sm" fontWeight="bold">
                        Ending in 0699
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Exp. 11/26
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <ChevronRightIcon boxSize={5} />
              </Box>
            )}
          </Box>
        </VStack>
      </Container>

      {!addressesLoading && (
        <>
          <AddressSelectModal
            isOpen={isOpen}
            onClose={onClose}
            onSelect={setSelectedAddress}
            addresses={addresses}
            onAddNewAddress={openAddressModal}
          />
          <AddressModal
            isOpen={isAddressModalOpen}
            onClose={closeAddressModal}
          />
        </>
      )}
    </>
  );
}
