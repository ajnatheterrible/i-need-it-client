import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Link,
} from "@chakra-ui/react";
import Footer from "../../components/layout/Footer";
import Container from "../../components/shared/Container";

export default function About() {
  return (
    <>
      <Container>
        <VStack spacing={16} align="stretch" py={10}>
          <Box>
            <Box bg="gray.300" w="full" h="300px" mb={6} borderRadius="md" />
            <Heading as="h1" fontSize="2xl" textAlign="center">
              I Need It is the one-stop destination for buying, selling and
              exploring menswear and womenswear.
            </Heading>
          </Box>

          <SimpleGrid columns={[1, null, 2]} spacing={12}>
            <Box>
              <Box bg="gray.300" w="full" h="200px" mb={4} borderRadius="md" />
            </Box>
            <VStack align="start" spacing={3}>
              <Heading as="h2" fontSize="lg">
                The Best Selection, at the Best Prices
              </Heading>
              <Text fontSize="sm" color="gray.700">
                Discover our marketplace for new and used clothing, from
                high-end to streetwear. We offer the largest selection
                available, with new products arriving daily.
              </Text>
            </VStack>
          </SimpleGrid>

          <SimpleGrid columns={[1, null, 2]} spacing={12}>
            <VStack align="start" spacing={3}>
              <Heading as="h2" fontSize="lg">
                Make Money From Your Closet
              </Heading>
              <Text fontSize="sm" color="gray.700">
                List your wardrobe on I Need It and find like-minded buyers from
                within our community. Listing an item is always free.
              </Text>
              <HStack mt={6}>
                <Button variant="outline" size="sm">
                  Sell an Item
                </Button>
                <Button variant="outline" size="sm">
                  Seller Protection
                </Button>
              </HStack>
            </VStack>
            <Box bg="gray.300" w="full" h="200px" borderRadius="md" />
          </SimpleGrid>

          <VStack spacing={3}>
            <Heading fontSize="lg">
              Free for Buyers, Low Commission Fee for Sellers
            </Heading>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Post any item for free. I Need It only charges a 9% commission
              when your item sells.
            </Text>
          </VStack>

          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <Box>
              <Box bg="gray.300" w="full" h="250px" borderRadius="md" />
            </Box>
            <VStack align="start" spacing={3}>
              <Heading fontSize="lg">Browse, Buy, Sell on the Go</Heading>
              <Text fontSize="sm" color="gray.700">
                The I Need It app lets you access notifications, saved searches,
                and messages on mobile.
              </Text>
              <Button size="sm" variant="outline" mt={6}>
                iOS
              </Button>
            </VStack>
          </SimpleGrid>

          <SimpleGrid columns={[1, null, 2]} spacing={12} alignItems="center">
            <VStack align="start" spacing={3}>
              <Heading fontSize="lg">Shop, Study, Stay in the Know</Heading>
              <Text fontSize="sm" color="gray.700">
                Discover style guides, designer deep dives, and our editorial
                platform.
              </Text>
              <Button size="sm" variant="outline" mt={6}>
                Read Articles
              </Button>
            </VStack>
            <Box bg="gray.300" w="full" h="250px" borderRadius="md" />
          </SimpleGrid>

          <SimpleGrid columns={[1, null, 2]} spacing={12}>
            <Box bg="gray.300" w="full" h="200px" borderRadius="md" />
            <Box bg="gray.300" w="full" h="200px" borderRadius="md" />
          </SimpleGrid>

          <VStack spacing={3} textAlign="center">
            <Heading fontSize="lg">Be Social</Heading>
            <Text fontSize="sm" color="gray.700">
              Follow us on Instagram to stay up to date on the biggest moments
              in menswear.
            </Text>
            <Button size="sm" variant="outline" mt={6}>
              Instagram
            </Button>
          </VStack>

          <SimpleGrid columns={[1, null, 2]} spacing={12}>
            <VStack align="start" spacing={3}>
              <Heading fontSize="lg">More About Us</Heading>
              <Text fontSize="sm" color="gray.700">
                I Need It is owned and operated by TARDEMAH Group. Learn more
                about our parent company and browse open roles.
              </Text>
              <Button size="sm" variant="outline" mt={6}>
                Learn More
              </Button>
            </VStack>
            <Box bg="gray.300" w="full" h="200px" borderRadius="md" />
          </SimpleGrid>

          <VStack spacing={3} textAlign="center">
            <Heading fontSize="md">Questions?</Heading>
            <Text fontSize="sm" color="gray.700">
              Visit our Help Section for frequently asked questions and contact
              info.
            </Text>
            <Button size="sm" variant="outline" mt={6}>
              Visit the Help Center
            </Button>
          </VStack>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
