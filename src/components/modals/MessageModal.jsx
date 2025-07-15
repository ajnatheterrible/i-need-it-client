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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function MessageModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  const handleSend = () => {
    toast({
      title: "Message sent.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    handleClose();
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
            <Text fontSize="xs" fontWeight="semibold" mb={2}>
              Send a message
            </Text>
            <Textarea
              placeholder="Send a message to request more details or discuss price."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              resize="none"
              minHeight="150px"
              borderColor="gray.400"
              _focus={{ borderColor: "black" }}
              bg="#ffffff"
            />

            <Text mt={6} fontSize="xs" textAlign="center" color="gray.600">
              We ensure that the items we review are authentic. All purchases
              made on I Need It are eligible for protection.
            </Text>
            <Text mt={1} fontSize="xs" textAlign="center">
              <u>Learn more</u>
            </Text>
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
              isDisabled={message.trim().length === 0}
              onClick={handleSend}
            >
              SEND MESSAGE
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
}
