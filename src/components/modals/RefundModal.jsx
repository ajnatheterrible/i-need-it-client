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
  RadioGroup,
  Radio,
  Input,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const REASONS = [
  "I no longer have this item",
  "I don't ship internationally",
  "I don't want to sell it anymore",
  "It is damaged",
  "Buyer had incorrect address",
  "The buyer requested a refund",
  "I am traveling or busy",
  "Other",
];

export default function IssueRefundModal({
  isOpen,
  onClose,
  maxRefundAmount,
  onSubmit,
}) {
  const [mode, setMode] = useState("full");
  const [amountInput, setAmountInput] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setMode("full");
      setAmountInput(maxRefundAmount != null ? maxRefundAmount.toFixed(2) : "");
      setReason("");
      setNote("");
      setSubmitting(false);
      setErrorMessage("");
    }
  }, [isOpen, maxRefundAmount]);

  const parsedAmount = (() => {
    const n = parseFloat(amountInput.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) return 0;
    return Math.round(n * 100) / 100;
  })();

  const isAmountValid =
    mode === "full"
      ? maxRefundAmount != null && maxRefundAmount > 0
      : parsedAmount > 0 &&
        maxRefundAmount != null &&
        parsedAmount <= maxRefundAmount;

  const canSubmit =
    !submitting &&
    isAmountValid &&
    reason.trim().length > 0 &&
    note.trim().length > 0;

  const handleModeChange = (next) => {
    setMode(next);
    if (next === "full" && maxRefundAmount != null) {
      setAmountInput(maxRefundAmount.toFixed(2));
    } else if (next === "partial" && amountInput === "") {
      setAmountInput("");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || !onSubmit) return;

    const payload = {
      mode,
      amount: mode === "full" ? maxRefundAmount : parsedAmount,
      reason,
      note: note.trim(),
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
          "Something went wrong while issuing the refund";
        setErrorMessage(msg);
        return;
      }

      toast({
        title: "Refund issued",
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
        "Something went wrong while issuing the refund";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const maxLabel =
    maxRefundAmount != null
      ? `Total refundable amount: $${maxRefundAmount.toFixed(2)}`
      : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="0">
        <ModalCloseButton />
        <ModalBody pt={10} pb={8} px={10}>
          <VStack align="stretch" spacing={6}>
            <Text fontSize="lg" fontWeight="semibold" textAlign="center">
              Issue refund
            </Text>

            <RadioGroup value={mode} onChange={handleModeChange}>
              <VStack align="stretch" spacing={3}>
                <HStack spacing={3}>
                  <Radio value="full">
                    <Text fontSize="sm" fontWeight="semibold">
                      Issue full refund
                    </Text>
                  </Radio>
                </HStack>

                <VStack align="stretch" spacing={1}>
                  <HStack
                    spacing={3}
                    align="flex-start"
                    justify="space-between"
                  >
                    <VStack align="flex-start" spacing={1}>
                      <Radio value="partial">
                        <Text fontSize="sm" fontWeight="semibold">
                          Issue partial refund
                        </Text>
                      </Radio>
                      {maxLabel && (
                        <Text fontSize="xs" color="gray.500">
                          {maxLabel}
                        </Text>
                      )}
                    </VStack>
                    <HStack w="160px">
                      <Box
                        as="span"
                        fontSize="sm"
                        color={mode === "partial" ? "gray.800" : "gray.400"}
                      >
                        $
                      </Box>
                      <Input
                        size="sm"
                        borderRadius="0"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        isDisabled={mode !== "partial"}
                      />
                    </HStack>
                  </HStack>
                  {mode === "partial" && !isAmountValid && (
                    <Text fontSize="xs" color="red.500">
                      Enter an amount up to $
                      {maxRefundAmount?.toFixed(2) || "0.00"}
                    </Text>
                  )}
                </VStack>
              </VStack>
            </RadioGroup>

            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  Refund Reason
                </Text>
                <Text fontSize="xs" color="red.500">
                  Required
                </Text>
              </HStack>
              <Select
                placeholder="Select reason"
                borderRadius="0"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </VStack>

            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  Note
                </Text>
                <Text fontSize="xs" color="red.500">
                  Required
                </Text>
              </HStack>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                resize="vertical"
                minH="120px"
                borderRadius="0"
              />
            </VStack>

            {errorMessage && (
              <Text fontSize="xs" color="red.500">
                {errorMessage}
              </Text>
            )}

            <Button
              mt={2}
              w="100%"
              borderRadius="0"
              colorScheme="blackAlpha"
              isDisabled={!canSubmit}
              isLoading={submitting}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
