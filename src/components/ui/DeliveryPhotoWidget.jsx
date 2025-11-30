import { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Image,
  Fade,
} from "@chakra-ui/react";
import useAuthStore from "../../store/authStore";

export default function DeliveryPhotoWidget({
  orderId,
  blurredSrc = "/assets/blurred_delivery_photo.png",
  clearSrc = "/assets/delivery_photo.png",
}) {
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((s) => s.token);

  const handleSubmit = async () => {
    if (!token) {
      setError("You must be logged in to view this photo.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/verify-zip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postalCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError("Error: Postal code is not valid");
        setRevealed(false);
      } else {
        setError("");
        setRevealed(true);
      }
    } catch (err) {
      setError("Error: Could not verify postal code");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative" overflow="hidden" bg="blackAlpha.700">
      <Image
        src={revealed ? clearSrc : blurredSrc}
        alt="Delivery photo"
        w="100%"
        h="auto"
        objectFit="cover"
        transition="filter 0.3s ease"
      />

      {!revealed && (
        <Fade in={!revealed}>
          <Box
            position="absolute"
            inset={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="rgba(0,0,0,0.45)"
            backdropFilter="blur(4px)"
          >
            <VStack
              bg="rgba(255,255,255,0.9)"
              p={4}
              w="85%"
              spacing={3}
              boxShadow="lg"
            >
              <Text fontWeight="semibold" color="gray.900" textAlign="center">
                Delivery Photo Available
              </Text>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                For security purposes, enter the destination postal code to view
                the photo
              </Text>

              <Input
                placeholder="Enter postal code"
                value={postalCode}
                fontSize="xs"
                textAlign="center"
                onChange={(e) => setPostalCode(e.target.value)}
                borderColor={error ? "red.400" : "gray.300"}
                focusBorderColor={error ? "red.400" : "blue.400"}
                bg="white"
              />

              {error && (
                <Text fontSize="xs" color="red.500">
                  {error}
                </Text>
              )}

              <Button
                onClick={handleSubmit}
                isLoading={loading}
                colorScheme="gray"
                bg="gray.200"
                _hover={{ bg: "gray.300" }}
                w="full"
                size="sm"
              >
                View Photo
              </Button>
            </VStack>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
