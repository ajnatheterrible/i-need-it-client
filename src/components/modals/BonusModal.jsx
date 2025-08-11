import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import ConfettiCanvas from "../ui/ConfettiCanvas";

export default function BonusModal({ isOpen, onClose, finalFocusRef }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
      motionPreset="scale"
      finalFocusRef={finalFocusRef}
    >
      <ModalOverlay zIndex={1300} />
      {isOpen && (
        <ConfettiCanvas
          duration={3000}
          zIndex={1350}
          colors={["#4f4f4f", "#b3b3b3", "#e4e4e4", "#ffffff"]}
        />
      )}
      <ModalContent
        py={8}
        px={6}
        textAlign="center"
        zIndex={1400}
        borderRadius="none"
      >
        <ModalHeader p={0}>
          <Heading size="lg">You Need It</Heading>
        </ModalHeader>
        <ModalBody p={0} mt={4}>
          <Text fontSize="md">
            As one of our first users, you’ve received <strong>$5,000</strong>{" "}
            in store credit to spend on I Need It
          </Text>
        </ModalBody>
        <ModalFooter mt={6} p={0} justifyContent="center">
          <Button colorScheme="blackAlpha" onClick={onClose}>
            Start Shopping
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
