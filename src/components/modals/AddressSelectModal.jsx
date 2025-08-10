import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Text,
  Button,
  RadioGroup,
  Radio,
  Divider,
  HStack,
  Container,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";

export default function AddressSelectModal({
  isOpen,
  onClose,
  addresses,
  onSelect,
  onAddNewAddress,
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(null);
    }
  }, [isOpen]);

  const handleDone = () => {
    if (selectedIndex !== null) {
      onSelect(addresses[selectedIndex]);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent p={0} borderRadius="none">
        <ModalHeader
          fontWeight="bold"
          fontSize="xl"
          textAlign="center"
          pt={6}
          pb={4}
        >
          My addresses
        </ModalHeader>
        <Divider borderColor="gray.200" />
        <ModalCloseButton />
        <ModalBody pt={4} pb={2}>
          <RadioGroup
            onChange={(val) => setSelectedIndex(Number(val))}
            value={selectedIndex}
          >
            <VStack spacing={0} align="stretch">
              {addresses?.map((address, idx) => (
                <Box key={idx} py={4} px={1}>
                  <HStack
                    align="center"
                    spacing={8}
                    mx="auto"
                    onClick={() => setSelectedIndex(idx)}
                    _hover={{ cursor: "pointer" }}
                  >
                    <Radio
                      colorScheme="gray"
                      value={idx}
                      isChecked={selectedIndex === idx}
                      mt={1}
                      onClick={() => setSelectedIndex(idx)}
                    />
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">
                        {address.fullName}
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold" mb={1}>
                        {address.line1}
                      </Text>
                      {address.line2 && (
                        <Text fontSize="sm">{address.line2}</Text>
                      )}
                      <Text fontSize="xs" color="gray.600">
                        {address.city}, {address.state} {address.zip}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {address.country}
                      </Text>
                    </Box>
                  </HStack>
                  {idx !== addresses.length - 1 && (
                    <Divider mt={4} borderColor="gray.200" />
                  )}
                </Box>
              ))}
            </VStack>
          </RadioGroup>

          <Divider my={6} />

          <HStack
            as="button"
            spacing={2}
            fontWeight="medium"
            fontSize="sm"
            onClick={() => {
              onClose();
              onAddNewAddress();
            }}
            px={1}
          >
            <AddIcon boxSize={3} />
            <Text textDecor="underline">Add new address</Text>
          </HStack>
        </ModalBody>
        <ModalFooter p={6}>
          <Button
            width="100%"
            bg="black"
            color="white"
            borderRadius="none"
            fontWeight="bold"
            onClick={handleDone}
            isDisabled={selectedIndex === null}
            _hover={{ opacity: 0.9 }}
          >
            Select
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
