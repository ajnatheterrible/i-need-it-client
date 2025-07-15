import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";

export default function Contact() {
  return (
    <>
      <Container>
        <VStack spacing={8} align="start" py={10}>
          <Text fontSize="3xl" fontWeight="bold">
            Submit a request
          </Text>
          <Text fontSize="sm" color="gray.600">
            Fields marked with an asterisk (*) are required.
          </Text>

          <VStack as="form" spacing={6} width="100%" align="stretch">
            <FormControl isRequired>
              <FormLabel>Your email address</FormLabel>
              <Input type="email" placeholder="you@example.com" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input type="text" placeholder="Enter subject" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>How can we help?</FormLabel>
              <Select placeholder="-">
                <option>Account help</option>
                <option>Report a bug</option>
                <option>Shipping/Returns</option>
                <option>General question</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Please enter the details of your request. A member of our support staff will respond as soon as possible."
                rows={6}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Attachments</FormLabel>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={4}
                textAlign="center"
                color="gray.500"
              >
                Choose a file or drag and drop here
              </Box>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blackAlpha"
              size="md"
              width="fit-content"
            >
              Submit
            </Button>
          </VStack>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
