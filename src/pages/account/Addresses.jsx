import {
  Box,
  Grid,
  GridItem,
  VStack,
  Text,
  Heading,
  HStack,
  Button,
  Divider,
  Link,
} from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import AccountSidebar from "../../components/sidebars/AccountSidebar";

export default function Addresses() {
  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={8} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            <HStack justify="space-between" mb={8}>
              <Heading size="md">Addresses</Heading>
              <Button size="sm" variant="outline">
                + ADD NEW ADDRESS
              </Button>
            </HStack>

            <VStack spacing={10} align="start" fontSize="sm">
              <Box w="100%">
                <Heading size="sm" mb={3}>
                  Default Return Address
                </Heading>
                <Text fontWeight="medium">Joey Pereira</Text>
                <Text>2445 NW 158th St</Text>
                <Text>Opa Locka, FL 33054</Text>
                <Text>United States</Text>
                <Link mt={1} color="blue.600" fontWeight="medium">
                  Edit
                </Link>
                <Divider mt={4} />
              </Box>

              <Box w="100%">
                <Heading size="sm" mb={3}>
                  All Shipping Addresses
                </Heading>
                <Text fontWeight="medium">Joey Pereira</Text>
                <Text>2445 NW 158th St</Text>
                <Text>Opa Locka, FL 33054</Text>
                <Text>United States</Text>
                <Link mt={1} color="blue.600" fontWeight="medium">
                  Edit
                </Link>
                <Divider mt={4} />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
