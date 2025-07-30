// components/modals/AddressSelectModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

export default function AddressSelectModal({
  isOpen,
  onClose,
  addresses,
  onSelect,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent p={4} borderRadius="lg">
        <ModalHeader fontSize="lg">Select Shipping From Address</ModalHeader>
        <ModalCloseButton />
        <ModalBody pt={2} pb={6}>
          <VStack spacing={6} align="stretch">
            {addresses?.map((address, idx) => (
              <Box
                key={idx}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={5}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => {
                  onSelect(address);
                  onClose();
                }}
              >
                <Text fontWeight="bold" mb={1}>
                  {address.fullName}
                </Text>
                <Text fontSize="sm" mb={1}>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </Text>
                <Text fontSize="sm" mb={1}>
                  {address.city}, {address.state} {address.zip}
                </Text>
                <Text fontSize="sm">{address.country}</Text>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
