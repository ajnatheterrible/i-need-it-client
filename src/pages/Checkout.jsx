import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  HStack,
  VStack,
  Divider,
  Button,
  RadioGroup,
  Radio,
  Image,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaBolt } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import Container from "../components/shared/Container";

export default function CheckoutPage() {
  return (
    <>
      <Container>
        <HStack justify="space-between" align="center" mt={8} mb={10}>
          <Box
            as={RouterLink}
            to="/"
            fontWeight="bold"
            fontSize="xl"
            letterSpacing="wide"
          >
            I NEED IT
          </Box>
          <Heading fontSize="2xl" fontWeight="bold" textAlign="center" flex="1">
            Item Checkout
          </Heading>
        </HStack>
      </Container>

      <Divider mb={10} />

      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={8} mb={10}>
          <GridItem colSpan={5}>
            <VStack spacing={10} align="start">
              <Box w="100%">
                <Heading size="sm" mb={3}>
                  Shipping Address
                </Heading>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  p={4}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Text fontWeight="medium">Joey Pereira</Text>
                    <Text>2445 NW 158th St</Text>
                    <Text>Opa Locka, FL 33054</Text>
                    <Text>United States</Text>
                  </Box>
                  <ChevronRightIcon boxSize={5} />
                </Box>
              </Box>

              <Box w="100%">
                <Heading size="sm" mb={2}>
                  Delivery
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Delivery estimates begin once the item ships. For 3 Day and
                  Next Day orders, we ask sellers to ship within 48 hours.
                </Text>
                <RadioGroup defaultValue="standard">
                  <VStack align="start" spacing={0} w="100%">
                    <Box w="100%" py={3}>
                      <Radio value="standard">
                        <HStack spacing={3}>
                          <FaBoxOpen />
                          <Text fontWeight="medium">Standard</Text>
                          <Text fontSize="sm" color="gray.500">
                            3–5 business days
                          </Text>
                        </HStack>
                      </Radio>
                    </Box>
                    <Divider />
                    <Box w="100%" py={3}>
                      <Radio value="ups3">
                        <HStack spacing={3}>
                          <FaTruck />
                          <Text fontWeight="medium">UPS 3 Day Ground</Text>
                          <Text fontSize="sm" color="gray.500">
                            2–3 business days
                          </Text>
                          <Text fontSize="sm" ml="auto">
                            + $5
                          </Text>
                        </HStack>
                      </Radio>
                    </Box>
                    <Divider />
                    <Box w="100%" py={3}>
                      <Radio value="nextday">
                        <HStack spacing={3}>
                          <FaBolt />
                          <Text fontWeight="medium">UPS Next Day Air</Text>
                          <Text fontSize="sm" color="gray.500">
                            Next business day
                          </Text>
                          <Text fontSize="sm" ml="auto">
                            + $15
                          </Text>
                        </HStack>
                      </Radio>
                    </Box>
                  </VStack>
                </RadioGroup>
              </Box>

              <Box w="100%">
                <Heading size="sm" mb={3}>
                  Select Your Payment Method
                </Heading>
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon as={FaRegCreditCard} boxSize={4} mt="1px" />
                    Card
                  </Button>
                  <Button variant="outline">
                    <Image
                      src="assets/logos/affirm.png"
                      alt="Affirm Logo"
                      height="24px"
                    />
                  </Button>
                  <Button variant="outline">
                    <Image
                      src="assets/logos/klarna.png"
                      alt="Klarna Logo"
                      height="30px"
                    />
                  </Button>
                </HStack>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mt={4}
                  p={4}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Text fontWeight="medium">VISA</Text>
                    <Text fontSize="sm" color="gray.500">
                      Ending in 0699
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Exp. 11/26
                    </Text>
                  </Box>
                  <ChevronRightIcon boxSize={5} />
                </Box>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={2} />

          <GridItem colSpan={5}>
            <VStack spacing={6} align="start" w="100%">
              <Box
                w="100%"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
              >
                <HStack spacing={4}>
                  <Box w="80px" h="80px" bg="gray.100" borderRadius="md">
                    <Image
                      src="/placeholder.jpg"
                      alt="Item"
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      borderRadius="md"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="bold">
                      Designer × Rick Owens × Luxury
                    </Text>
                    <Text fontSize="sm">
                      Rick Owens beat creeper tractor boots
                    </Text>
                    <Text fontSize="sm">Size: 9</Text>
                    <Text fontSize="sm">
                      Seller:{" "}
                      <Box as="span" fontWeight="medium">
                        whoisxajna
                      </Box>
                    </Text>
                  </Box>
                  <Text fontWeight="bold">$1,350</Text>
                </HStack>
              </Box>

              <Box w="100%">
                <Heading size="sm" mb={3}>
                  Order Details
                </Heading>
                <VStack align="start" spacing={2} w="100%">
                  <HStack justify="space-between" w="100%">
                    <Text>Listing Price</Text>
                    <Text>$1,350</Text>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <Text>Shipping</Text>
                    <Text>$24</Text>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <Text>
                      Estimated Tax{" "}
                      <InfoIcon boxSize={3} ml={1} color="gray.500" />
                    </Text>
                    <Text>$96.18</Text>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              <Box w="100%">
                <HStack justify="space-between" w="100%">
                  <Heading size="sm">Order Total</Heading>
                  <Heading size="sm">$1,470.18</Heading>
                </HStack>
              </Box>

              <Button
                w="100%"
                colorScheme="blackAlpha"
                color="white"
                bg="black"
                size="lg"
              >
                CONFIRM PURCHASE
              </Button>

              <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                  🛡 I Need It Purchase Protection
                </Text>
                <Text fontSize="sm" mb={2}>
                  Buy with confidence. Qualifying orders are covered by our
                  Purchase Protection in the rare case something goes wrong.
                  <Box as="span" textDecoration="underline" cursor="pointer">
                    {" "}
                    Learn more
                  </Box>
                </Text>
                <Text fontSize="xs" color="gray.500">
                  By proceeding, you are agreeing to the
                  <Box as="span" textDecoration="underline" cursor="pointer">
                    {" "}
                    Terms of Service
                  </Box>
                  , including our Returns / I Need It Purchase Protection
                  policy.
                </Text>
                <Text
                  fontSize="xs"
                  mt={3}
                  textDecoration="underline"
                  cursor="pointer"
                >
                  Learn more about taxes and eligibility.
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
