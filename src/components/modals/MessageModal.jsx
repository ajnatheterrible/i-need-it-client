import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Text,
  Divider,
  Button,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

export default function MessageModal({ isOpen, onClose, listingId, threadId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const token = useAuthStore((s) => s.token);

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          threadId,
          listingId,
          content: message,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }

      await res.json();

      toast({
        title: "Message sent",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      handleClose();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast({
        title: "Failed to send message.",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxW="500px" borderRadius={0}>
        <ModalHeader textAlign="center" fontWeight="bold">
          Ask a question
        </ModalHeader>
        <Divider />
        <ModalCloseButton />

        <Box px={6} py={6}>
          <ModalBody>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="150px"
                w="full"
              >
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Box>
            ) : (
              <>
                <Textarea
                  placeholder="Send a message to request more details or discuss price"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  resize="none"
                  minHeight="150px"
                  borderColor="gray.400"
                  _focus={{ borderColor: "black" }}
                  bg="#ffffff"
                  borderRadius="none"
                />

                <Text mt={6} fontSize="xs" textAlign="center" color="gray.600">
                  We ensure that the items we review are authentic. All
                  purchases made on I Need It are eligible for protection.
                </Text>
                <Text mt={1} fontSize="xs" textAlign="center">
                  <u>Learn more</u>
                </Text>
              </>
            )}
          </ModalBody>

          <ModalFooter p={0} mt={6}>
            <Button
              w="100%"
              py={6}
              bg="gray.200"
              color="gray.600"
              fontWeight="bold"
              borderRadius={0}
              _hover={{ bg: "gray.300" }}
              isDisabled={message.trim().length === 0 || loading}
              onClick={handleSend}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
