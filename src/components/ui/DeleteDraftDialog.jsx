import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";

function DeleteDraftDialog({ onConfirm, isSubmitting, page }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const isDraftPage = page === "drafts";

  return (
    <>
      <Button
        onClick={onOpen}
        isDisabled={isSubmitting}
        {...(isDraftPage
          ? {
              w: "100%",
              h: "30px",
              variant: "outline",
              color: "red.500",
              border: "1px solid",
              borderColor: "red.500",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "small",
              _hover: {
                bg: "red.50",
              },
              px: 6,
              py: 2,
            }
          : {
              variant: "outline",
              colorScheme: "red",
            })}
      >
        Discard
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent p={8}>
            <AlertDialogBody textAlign="center">
              Are you sure you want to permanently delete this draft? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center">
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                ml={4}
                isLoading={isSubmitting}
              >
                Discard
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteDraftDialog;
