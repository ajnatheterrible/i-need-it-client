import Hero from "../../components/shared/Hero";
import Footer from "../../components/layout/Footer";
import { VStack, Flex, Box, Text } from "@chakra-ui/react";
import Container from "../../components/shared/Container";

const Landing = () => {
  return (
    <>
      <Hero />
      <Container>
        <VStack spacing="64px" mt="64px" align="stretch">
          <Box>
            <Text textAlign="right" mb="16px">
              Recently Viewed
            </Text>
            <Flex gap="24px">
              <Box flex="1" h="300px" bg="gray.100" />
              <Box flex="1" h="300px" bg="gray.200" />
              <Box flex="1" h="300px" bg="gray.200" />
            </Flex>
          </Box>

          <Flex gap="24px">
            <Box flex="1" h="300px" bg="gray.100" />
            <Box flex="2" h="300px" bg="gray.200" />
          </Flex>

          <Box>
            <Text mb="16px">Latest Collections</Text>
            <Flex gap="24px">
              <Box flex="1" h="300px" bg="gray.100" />
              <Box flex="1" h="300px" bg="gray.200" />
              <Box flex="1" h="300px" bg="gray.200" />
            </Flex>
          </Box>

          <Flex gap="24px">
            <Box flex="2" h="300px" bg="gray.100" />
            <Box flex="1" h="300px" bg="gray.200" />
          </Flex>
        </VStack>
      </Container>
      <Footer />
    </>
  );
};

export default Landing;
