import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Box,
  HStack,
  Text,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

export default function CardSelectModal({ isOpen, onClose, cards, onSelect }) {
  const formatExp = (expMonth, expYear) => {
    const paddedMonth = expMonth.toString().padStart(2, "0");
    return `Exp. ${paddedMonth} / ${expYear}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      motionPreset="scale"
      isCentered
    >
      <ModalOverlay />
      <ModalContent borderRadius="none" p={4}>
        <ModalHeader textAlign="center">Saved cards</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {cards.map((card) => (
              <Box
                key={card.last4}
                p={4}
                w="full"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => {
                  onSelect(card);
                  onClose();
                }}
              >
                <HStack spacing={4}>
                  <Icon
                    as={card.cardType === "Visa" ? FaCcVisa : FaCcMastercard}
                    boxSize={5}
                    color="gray.700"
                  />
                  <VStack spacing={0} align="start">
                    <Text fontWeight="semibold" fontSize="sm">
                      Ending in {card.last4}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatExp(card.expMonth, card.expYear)}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
