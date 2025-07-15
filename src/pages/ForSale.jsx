import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  Select,
  SimpleGrid,
  Button,
  Image,
} from "@chakra-ui/react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

export default function ForSale() {
  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid templateColumns="repeat(12, 1fr)" gap={6} pt={6} w="full">
            <GridItem colSpan={2}>
              <SellerSidebar />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={4}>
                <Text fontSize="xl" fontWeight="bold">
                  For Sale
                </Text>

                <SimpleGrid columns={3} spacing={6} w="full">
                  {[...Array(9)].map((_, i) => (
                    <Box
                      key={i}
                      borderWidth="1px"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Box position="relative" height="200px">
                        <Image
                          src="/placeholder.jpg"
                          alt="Leather mask hooded jacket"
                          height="100%"
                          width="100%"
                          objectFit="cover"
                        />
                      </Box>

                      <Box p={3}>
                        <Text fontSize="xs" color="gray.500">
                          about 5 hours ago
                        </Text>
                        <Box
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          my={2}
                        />
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={1}
                        >
                          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                            THE VIRIDI-ANNE
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            M
                          </Text>
                        </Box>
                        <Text fontSize="xs" color="gray.600" noOfLines={1}>
                          Leather mask hooded jacket
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" mt={2}>
                          $1200
                        </Text>
                        <VStack spacing={2} mt={2} align="start">
                          <Button size="xs" variant="outline">
                            PRICE DROP
                          </Button>
                          <Button size="xs" variant="outline">
                            BUMP
                          </Button>
                          <Button size="xs" variant="outline">
                            SEND OFFER
                          </Button>
                        </VStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
