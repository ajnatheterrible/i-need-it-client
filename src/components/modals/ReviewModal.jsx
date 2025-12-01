import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  Box,
  useToast,
} from "@chakra-ui/react";
import { StarIcon, ChatIcon } from "@chakra-ui/icons";
import { FaBoxOpen, FaFireAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

const TAG_CONFIG = [
  { key: "FAST_SHIPPER", label: "Fast Shipper", icon: FaBoxOpen },
  { key: "ITEM_AS_DESCRIBED", label: "Item As Described", icon: FaFireAlt },
  { key: "QUICK_REPLIES", label: "Quick Replies", icon: ChatIcon },
];

function getRatingMeta(rating) {
  if (rating === 1) {
    return { label: "Not good", color: "red.500" };
  }
  if (rating === 2) {
    return { label: "Not so great", color: "orange.400" };
  }
  if (rating === 3) {
    return { label: "Meh... could've been better", color: "green.500" };
  }
  if (rating === 4) {
    return { label: "All good", color: "green.500" };
  }
  if (rating === 5) {
    return { label: "Great! Zero complaints", color: "green.500" };
  }
  return { label: "How was this order?", color: "gray.500" };
}

export default function ReviewModal({
  isOpen,
  onClose,
  mode = "create",
  initialReview = null,
  onSubmit,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      if (initialReview) {
        setRating(initialReview.rating || 0);
        setTags(initialReview.tags || []);
        setComment(initialReview.comment || "");
      } else {
        setRating(0);
        setTags([]);
        setComment("");
      }
      setHoverRating(0);
      setErrorMessage("");
    }
  }, [isOpen, initialReview]);

  const effectiveRating = hoverRating || rating;
  const meta = getRatingMeta(effectiveRating);

  const toggleTag = (key) => {
    if (tags.includes(key)) {
      setTags(tags.filter((t) => t !== key));
    } else {
      setTags([...tags, key]);
    }
  };

  const requiresComment = rating > 0 && rating <= 2;
  const isCommentValid = !requiresComment || comment.trim().length > 0;
  const canSubmit = rating > 0 && isCommentValid && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) return;

    const payload = {
      rating,
      tags,
      comment: comment.trim(),
    };

    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await onSubmit(payload);

      const success =
        result === undefined ||
        (typeof result === "object" ? result.success !== false : true);

      if (!success) {
        const msg =
          (result && result.error) ||
          "Something went wrong while submitting your review";
        setErrorMessage(msg);
        return;
      }

      toast({
        title: mode === "edit" ? "Feedback updated" : "Feedback submitted",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while submitting your review";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="0">
        <ModalCloseButton />
        <ModalBody pt={10} pb={8} px={10}>
          <VStack align="stretch" spacing={6}>
            <VStack spacing={3}>
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                {meta.label}
              </Text>
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Box
                    key={star}
                    cursor="pointer"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <StarIcon
                      boxSize={7}
                      color={star <= effectiveRating ? meta.color : "gray.300"}
                    />
                  </Box>
                ))}
              </HStack>
            </VStack>

            {rating >= 3 && (
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                  What did this seller do well?
                </Text>
                <VStack align="stretch" spacing={2}>
                  {TAG_CONFIG.map((tag) => {
                    const IconComp = tag.icon;
                    const isActive = tags.includes(tag.key);
                    return (
                      <Button
                        key={tag.key}
                        justifyContent="flex-start"
                        variant={isActive ? "solid" : "outline"}
                        borderRadius="0"
                        colorScheme={isActive ? "blackAlpha" : "gray"}
                        onClick={() => toggleTag(tag.key)}
                        leftIcon={<IconComp boxSize={4} />}
                      >
                        {tag.label}
                      </Button>
                    );
                  })}
                </VStack>
              </VStack>
            )}

            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                {requiresComment ? "Comment required" : "Leave a comment"}
              </Text>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                resize="vertical"
                minH="120px"
                borderRadius="0"
              />
              {requiresComment && (
                <Text fontSize="xs" color="gray.500">
                  Sorry to hear you didn't have a great experience with this
                  purchase. If there's anything we can do to help, please let us
                  know.
                </Text>
              )}
              {errorMessage && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  {errorMessage}
                </Text>
              )}
            </VStack>

            <Button
              mt={2}
              w="100%"
              borderRadius="0"
              colorScheme="blackAlpha"
              isDisabled={!canSubmit}
              isLoading={submitting}
              onClick={handleSubmit}
            >
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
