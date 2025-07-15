import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import AccountSidebar from "../../components/sidebars/AccountSidebar";

const menswearSizes = {
  Tops: ["XXS/40", "XS/42", "S/44-46", "M/48-50", "L/52-54", "XL/56", "XXL/58"],
  Bottoms: [
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
  ],
  Outerwear: [
    "XXS/40",
    "XS/42",
    "S/44-46",
    "M/48-50",
    "L/52-54",
    "XL/56",
    "XXL/58",
  ],
  Footwear: [
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "12.5",
    "13",
    "14",
    "15",
  ],
  Tailoring: [
    "34S",
    "34R",
    "36S",
    "36R",
    "38S",
    "38R",
    "38L",
    "40S",
    "40R",
    "40L",
    "42S",
    "42R",
    "42L",
    "44S",
    "44R",
    "44L",
    "46S",
    "46R",
    "46L",
    "48S",
    "48R",
    "48L",
    "50S",
    "50R",
    "50L",
    "52S",
    "52L",
    "54R",
    "54L",
    "62S",
    "62R",
  ],
  Accessories: [
    "OS",
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
  ],
};

export default function Sizes() {
  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={8} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            <VStack align="start" spacing={8}>
              <Box>
                <Heading size="md" mb={1}>
                  My Sizes
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Set up to filter out listings that are not in your size.
                </Text>
              </Box>

              <Tabs variant="unstyled">
                <TabList>
                  <Tab
                    _selected={{
                      borderBottom: "2px solid black",
                      fontWeight: "bold",
                    }}
                    pb={2}
                    mr={4}
                  >
                    MENSWEAR
                  </Tab>
                  <Tab
                    _selected={{
                      borderBottom: "2px solid black",
                      fontWeight: "bold",
                    }}
                    pb={2}
                  >
                    WOMENSWEAR
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <VStack align="start" spacing={8}>
                      {Object.entries(menswearSizes).map(
                        ([category, sizes]) => (
                          <Box key={category}>
                            <Text fontWeight="semibold" mb={2}>
                              {category}
                            </Text>
                            <SimpleGrid columns={[4, 6, 8]} spacing={3}>
                              {sizes.map((size) => (
                                <Checkbox key={size}>{size}</Checkbox>
                              ))}
                            </SimpleGrid>
                          </Box>
                        )
                      )}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <Text color="gray.500" fontSize="sm">
                      Womenswear sizing coming soon.
                    </Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Button
                mt={4}
                w="full"
                colorScheme="blackAlpha"
                bg="black"
                color="white"
              >
                SAVE MY SIZES
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
