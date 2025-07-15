import {
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Tabs,
  TabList,
  Tab,
  Image,
} from "@chakra-ui/react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

export default function PaymentsSeller() {
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
              <SellerSidebar active="PAYMENTS" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="2xl" fontWeight="bold">
                  Payments
                </Text>

                <Tabs variant="unstyled" w="full">
                  <TabList borderBottom="1px solid" borderColor="gray.300">
                    <Tab
                      fontWeight="bold"
                      fontSize="xs"
                      _selected={{
                        borderBottom: "2px solid black",
                        color: "black",
                      }}
                    >
                      PAYMENT METHODS
                    </Tab>
                  </TabList>
                </Tabs>

                <Alert
                  status="warning"
                  variant="subtle"
                  borderRadius="md"
                  bg="#FFFAF0"
                  border="1px solid #F6AD55"
                  alignItems="center"
                  p={4}
                >
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    Activate Stripe for lower{" "}
                    <Text as="span" textDecoration="underline">
                      payment processing charges
                    </Text>{" "}
                    on each sale.{" "}
                    <Text
                      as="span"
                      fontWeight="bold"
                      color="blue.600"
                      cursor="pointer"
                    >
                      Activate Stripe →
                    </Text>
                  </AlertDescription>
                </Alert>

                <HStack spacing={8} w="100%" justify="space-around" pt={4}>
                  <VStack align="center" spacing={3} w="300px">
                    <Image
                      src="/assets/logos/stripe.png"
                      alt="Stripe"
                      height="40px"
                      objectFit="contain"
                    />
                    <Text fontSize="sm" color="green.600">
                      ✓ Connected
                    </Text>
                    <Button
                      size="xs"
                      fontSize="xs"
                      variant="outline"
                      fontWeight="semibold"
                      w="full"
                    >
                      VIEW DASHBOARD
                    </Button>
                    <Button
                      size="xs"
                      fontSize="xs"
                      variant="outline"
                      fontWeight="semibold"
                      w="full"
                    >
                      EDIT ACCOUNT
                    </Button>
                  </VStack>

                  <VStack align="center" spacing={3} w="300px">
                    <Image
                      src="/assets/logos/paypal.png"
                      alt="PayPal"
                      height="40px"
                      objectFit="contain"
                    />
                    <Text fontSize="sm" color="green.600">
                      ✓ Connected
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Merchant ID: XDXHH3SKPC4BU
                    </Text>
                    <Button
                      size="xs"
                      fontSize="xs"
                      variant="outline"
                      fontWeight="semibold"
                      w="full"
                    >
                      EDIT ACCOUNT
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
