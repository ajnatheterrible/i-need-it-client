import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertDescription,
  Image,
} from "@chakra-ui/react";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { motion } from "framer-motion";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar";

import useFetchPaymentMethods from "../hooks/useFetchPaymentMethods";
import useAuthStore from "../store/authStore";

export default function Payments() {
  const { loading } = useFetchPaymentMethods();
  const paymentMethods = useAuthStore((s) => s.fetchedData?.paymentMethods);

  const formatExp = (expMonth, expYear) => {
    const paddedMonth = expMonth.toString().padStart(2, "0");
    return `Exp. ${paddedMonth} / ${expYear}`;
  };

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={8} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={8}>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="60vh"
                w="full"
              >
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <VStack align="start" spacing={6} w="full">
                  <Text fontSize="xl" fontWeight="bold">
                    Payments
                  </Text>

                  <Tabs variant="unstyled" w="full">
                    <TabList borderBottom="1px solid" borderColor="gray.300">
                      <Tab
                        fontWeight="semibold"
                        fontSize="sm"
                        _selected={{
                          borderBottom: "2px solid black",
                          color: "black",
                        }}
                      >
                        Saved Cards
                      </Tab>
                      <Tab
                        fontWeight="semibold"
                        fontSize="sm"
                        _selected={{
                          borderBottom: "2px solid black",
                          color: "black",
                        }}
                      >
                        Payment Accounts
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel px={0}>
                        <HStack w="full" justify="flex-end">
                          <Button size="sm" variant="outline" fontSize="xs">
                            + Add New Card
                          </Button>
                        </HStack>

                        <HStack spacing={12} align="start" pt={4}>
                          {paymentMethods?.map((card, idx) => (
                            <Box
                              key={idx}
                              minW="200px"
                              borderTop="1px solid #e2e8f0"
                              pt={4}
                            >
                              <VStack align="start" spacing={1}>
                                <HStack spacing={2}>
                                  <Icon
                                    as={
                                      card.cardType === "Visa"
                                        ? FaCcVisa
                                        : FaCcMastercard
                                    }
                                    boxSize={6}
                                    color="gray.700"
                                  />
                                  <Text fontWeight="bold" fontSize="sm">
                                    Ending in {card.last4}
                                  </Text>
                                </HStack>

                                <Text fontSize="xs" color="gray.600">
                                  {formatExp(card.expMonth, card.expYear)}
                                </Text>

                                {!card.isDefault && (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    color="red.500"
                                    fontSize="xs"
                                    mt={2}
                                  >
                                    Remove
                                  </Button>
                                )}

                                {card.isDefault && (
                                  <Text
                                    mt={2}
                                    fontSize="xs"
                                    fontWeight="semibold"
                                  >
                                    Default
                                  </Text>
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </HStack>
                      </TabPanel>

                      <TabPanel px={0}>
                        <Alert
                          status="info"
                          variant="subtle"
                          borderRadius="md"
                          bg="gray.100"
                          border="1px solid"
                          borderColor="gray.300"
                          alignItems="center"
                          p={4}
                          mt={4}
                          mb={4}
                        >
                          <AlertIcon color="gray.500" />
                          <AlertDescription fontSize="sm" color="gray.800">
                            Activate Stripe for lower payment processing charges
                            on each sale.{" "}
                            <Text
                              as="span"
                              fontWeight="semibold"
                              cursor="pointer"
                              textDecoration="underline"
                            >
                              Activate Stripe →
                            </Text>
                          </AlertDescription>
                        </Alert>

                        <HStack
                          spacing={8}
                          w="100%"
                          justify="space-around"
                          pt={6}
                        >
                          <VStack align="center" spacing={3} w="300px">
                            <Image
                              src="/assets/logos/stripe.png"
                              alt="Stripe"
                              height="30px"
                              objectFit="contain"
                            />
                            <Text fontSize="sm">✓ Connected</Text>
                            <Button
                              size="xs"
                              fontSize="xs"
                              variant="outline"
                              fontWeight="semibold"
                              w="full"
                            >
                              View Dashboard
                            </Button>
                            <Button
                              size="xs"
                              fontSize="xs"
                              variant="outline"
                              fontWeight="semibold"
                              w="full"
                            >
                              Edit Account
                            </Button>
                          </VStack>

                          <VStack align="center" spacing={3} w="300px">
                            <Image
                              src="/assets/logos/paypal.png"
                              alt="PayPal"
                              height="40px"
                              objectFit="contain"
                            />
                            <Text fontSize="sm">✓ Connected</Text>
                            <Text fontSize="xs" color="gray.600">
                              Merchant ID: XZXHR3SKPC1ZP
                            </Text>
                            <Button
                              size="xs"
                              fontSize="xs"
                              variant="outline"
                              fontWeight="semibold"
                              w="full"
                            >
                              Edit Account
                            </Button>
                          </VStack>
                        </HStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </motion.div>
            )}
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
