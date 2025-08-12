import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Heading,
  Image,
  Button,
  Grid,
} from "@chakra-ui/react";
import { PuffLoader } from "react-spinners";

import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";

import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";

import useFetchOrder from "../../hooks/useFetchOrder";

export default function ConfirmationPage() {
  const { id } = useParams();
  const { loading, order, error } = useFetchOrder(id);

  const formatCurrency = (n) =>
    typeof n === "number"
      ? `$${n.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$0.00";

  if (loading) {
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

  if (error || !order) {
    return (
      <Container>
        <Box maxW="2xl" mx="auto" py={10} textAlign="center">
          <Heading size="lg" mb={4}>
            Uh oh.
          </Heading>
          <Text color="gray.600" mb={6}>
            {error || "We couldn’t find that order."}
          </Text>
          <Button
            as={RouterLink}
            to="/shop"
            variant="outline"
            colorScheme="blackAlpha"
          >
            Back to Shop
          </Button>
        </Box>
        <Footer />
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Box maxW="2xl" mx="auto" py={10}>
          <VStack spacing={8} align="center" textAlign="center">
            <Heading size="lg" letterSpacing="wide">
              I NEED IT
            </Heading>

            <Text fontSize="xl" fontWeight="medium">
              Congrats on your purchase!
            </Text>

            <Text fontSize="xs" color="gray.500">
              Order #{order?._id}
            </Text>

            <Divider />

            <Grid
              templateColumns="100px max-content max-content"
              gap={10}
              justifyContent="center"
              alignItems="start"
              w="full"
            >
              <Image
                src={
                  order?.listingSnapshot?.imageUrl || "/assets/placeholder.png"
                }
                alt={order?.listingSnapshot?.title || "Item"}
                boxSize="100px"
                objectFit="cover"
              />

              <VStack spacing={2} align="center">
                <Text fontWeight="bold" fontSize="sm">
                  ITEM
                </Text>
                <Box textAlign="left">
                  <Text fontWeight="semibold" fontSize="sm">
                    {order?.listingSnapshot?.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {order?.listingSnapshot?.designer}
                  </Text>
                  <Text fontSize="xs">
                    Size: {order?.listingSnapshot?.size}
                  </Text>
                </Box>
              </VStack>

              <VStack spacing={2} align="flex-start">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  w="full"
                  textAlign="center"
                >
                  SHIPPING DETAILS
                </Text>
                <Box fontSize="xs" textAlign="left">
                  <Text fontWeight="semibold">
                    {order?.shippingAddress?.fullName}
                  </Text>
                  <Text>{order?.shippingAddress?.line1}</Text>
                  {order?.shippingAddress?.line2 && (
                    <Text>{order?.shippingAddress?.line2}</Text>
                  )}
                  <Text>
                    {order?.shippingAddress?.city},{" "}
                    {order?.shippingAddress?.state}{" "}
                    {order?.shippingAddress?.zip}
                  </Text>
                  <Text>{order?.shippingAddress?.country}</Text>
                </Box>
              </VStack>
            </Grid>

            <Box border="1px solid black" py={2} px={4}>
              <Text fontWeight="bold">
                TOTAL: {formatCurrency(order?.price?.total)}
              </Text>
            </Box>

            <Divider />

            <Box fontSize="xs" color="gray.600" maxW="4xl">
              <Text>
                We’ll email you with a tracking number once the seller ships
                your item.
              </Text>
              <Text mt={2}>
                Every order on I Need It is protected by our{" "}
                <Text as="span" fontWeight="semibold" color="black">
                  100% money-back guarantee
                </Text>
                .
              </Text>
            </Box>

            <Divider />

            <VStack spacing={2} fontSize="sm">
              <Text fontWeight="bold">Estimated Shipping Time:</Text>
              <Text>Domestic: 1–2 weeks</Text>
            </VStack>

            <Button
              variant="outline"
              colorScheme="blackAlpha"
              as={RouterLink}
              to="/shop"
            >
              Continue Shopping
            </Button>

            <Divider />

            <VStack spacing={2} pt={4}>
              <Text fontWeight="semibold">More Questions?</Text>
              <Text fontSize="sm" color="gray.600">
                Reach out to us anytime, we're here to help.
              </Text>
            </VStack>
            <Button
              size="sm"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              as={RouterLink}
              to={"/contact-us"}
            >
              Contact Support
            </Button>
          </VStack>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
