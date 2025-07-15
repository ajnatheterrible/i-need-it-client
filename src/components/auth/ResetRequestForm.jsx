import { Input, Button, Text, VStack, Box } from "@chakra-ui/react";

export default function ResetRequestForm({
  email,
  setEmail,
  loading,
  error,
  onSubmit,
  onKeyDown,
}) {
  return (
    <VStack spacing={8}>
      <VStack spacing={4}>
        <Text>Enter your email and we’ll send you a reset link</Text>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
      <Button colorScheme="blackAlpha" onClick={onSubmit} isLoading={loading}>
        SEND RESET LINK
      </Button>
    </VStack>
  );
}
