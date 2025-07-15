import { Box, Text, Flex, Image } from "@chakra-ui/react";
import Footer from "../../components/layout/Footer";

export default function NotFound() {
  return (
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
          404 - Page Not Found
        </Text>
        <Image
          src="/assets/model.png"
          alt="Model in Rick"
          maxH="500px"
          objectFit="contain"
        />
      </Flex>
      <Footer />
    </Flex>
  );
}
