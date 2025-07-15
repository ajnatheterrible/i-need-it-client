import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Switch,
  Icon,
} from "@chakra-ui/react";
import { FaShippingFast } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

export default function SellerSettings() {
  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            pt={6}
            pb={10}
            w="full"
          >
            <GridItem colSpan={2}>
              <SellerSidebar active="SETTINGS" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="2xl" fontWeight="bold">
                  Settings
                </Text>

                <Box w="full">
                  <HStack borderBottom="1px solid" borderColor="gray.300">
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      borderBottom="2px solid black"
                      pb={2}
                    >
                      SHIPPING LABELS
                    </Text>
                  </HStack>
                </Box>

                <Text fontSize="sm" color="gray.600">
                  Only applies to U.S. and Canadian Sellers shipping to the U.S.{" "}
                  <Text as="span" color="blue.600" cursor="pointer">
                    Learn More
                  </Text>
                </Text>

                <Box
                  w="full"
                  bgGradient="linear(to-r, green.600, green.400)"
                  borderRadius="md"
                  p={4}
                  color="white"
                >
                  <HStack justify="space-between" align="start">
                    <Box>
                      <Text fontSize="xs" fontStyle="italic">
                        U.S. Sellers Only
                      </Text>
                      <Text fontWeight="bold">Expedited Delivery</Text>
                      <Text fontSize="sm">
                        Offer expedited delivery options to your U.S. buyers at
                        checkout. You must be able to ship within 48 hours if
                        buyer chooses expedited delivery at checkout.
                      </Text>
                      <Text fontSize="xs" fontStyle="italic" pt={2}>
                        Required For:{" "}
                        <Icon
                          as={FaShippingFast}
                          boxSize={4}
                          color="white"
                          mb={-0.5}
                        />{" "}
                        <b>Speedy Shipper Badge</b>
                      </Text>
                    </Box>
                    <Switch defaultChecked size="lg" colorScheme="gray" />
                  </HStack>
                </Box>

                <Box w="full" bg="white" borderRadius="md" px={4} py={3}>
                  <HStack justify="space-between" w="full" align="flex-start">
                    <Box>
                      <Text fontWeight="semibold">Thermal Printing</Text>
                      <Text fontSize="sm" color="gray.600">
                        Make all your pre-paid labels print on a 4” x 6” thermal
                        label. Requires a Thermal Printer.
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        <Text as="span" fontWeight="bold">
                          Please note:
                        </Text>{" "}
                        updating your printing settings only applies to listings
                        sold after the changes are made.
                      </Text>
                    </Box>
                    <Switch size="lg" colorScheme="gray" />
                  </HStack>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
