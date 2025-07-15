import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";

export default function OAuthErrorModal({ isOpen, onClose, errorType }) {
  let message = "There was a problem signing in.";

  if (errorType === "login_type_mismatch") {
    message =
      "There was a problem signing in. Try logging in using a different method.";
  } else if (errorType === "oauth_no_user") {
    message = "Account not found. Please sign up first.";
  } else if (errorType === "oauth_unknown_error") {
    message = "Something went wrong during sign-in. Try again.";
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader textAlign="center">Login error</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text textAlign="center">{message}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
