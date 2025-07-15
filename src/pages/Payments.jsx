import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar";

export default function Payments() {
  const cards = [
    {
      brand: "visa",
      last4: "0699",
      exp: "11/26",
    },
    {
      brand: "mastercard",
      last4: "6219",
      exp: "3/29",
    },
  ];

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            <VStack align="start" spacing={6} w="full">
              <Text fontSize="2xl" fontWeight="bold">
                Payments
              </Text>

              <Box borderBottom="2px solid black" pb={1} fontWeight="bold">
                <Text fontSize="sm" fontWeight="semibold">
                  SAVED CARDS
                </Text>
              </Box>

              <Box alignSelf="flex-end">
                <Button size="sm" variant="outline" fontSize="xs">
                  + ADD NEW CARD
                </Button>
              </Box>

              <HStack spacing={12} align="start" pt={4}>
                {cards.map((card, idx) => (
                  <Box
                    key={idx}
                    minW="200px"
                    borderTop="1px solid #e2e8f0"
                    pt={4}
                  >
                    <VStack align="start" spacing={1}>
                      <Icon
                        as={card.brand === "visa" ? FaCcVisa : FaCcMastercard}
                        boxSize={6}
                        color="gray.700"
                      />
                      <Text fontWeight="bold" fontSize="sm">
                        Ending in {card.last4}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Exp. {card.exp}
                      </Text>
                      <Button
                        variant="link"
                        size="sm"
                        color="red.500"
                        fontSize="sm"
                        mt={1}
                      >
                        Remove
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </HStack>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
