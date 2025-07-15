import { Text, Flex } from "@chakra-ui/react";
import Footer from "../../components/layout/Footer";
import NavbarGuest from "../../components/layout/NavbarGuest";

export default function OfflinePage() {
  return (
    <>
      <NavbarGuest />
      <Flex direction="column" minHeight="100vh" justify="space-between">
        <Flex
          direction="column"
          align="center"
          justify="center"
          flex="1"
          py={6}
          px={2}
        >
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8}>
            You’re offline
          </Text>
          <Text fontSize="md" textAlign="center" color="gray.500" mb={6}>
            Please check your internet connection and try again.
          </Text>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
