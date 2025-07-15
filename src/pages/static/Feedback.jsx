import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import SellerSidebar from "../../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../../components/profile/SellerProfileHeader";

export default function Feedback() {
  const feedback = [
    {
      id: 1,
      date: "March 16, 2025",
      text: "Amazing, fast shipping and communication on point. thanks a lot",
      brand: "Rick Owens",
      title: "Perforated Pull-On Square Boots",
      tags: ["Fast Shipper", "Item As Described", "Quick Replies"],
    },
    {
      id: 2,
      date: "March 14, 2025",
      text: "packaged weird so the collar is a bit messed up other than that basically perfect",
      brand: "Somar",
      title: "Blood Pixel Waxed Moto Jacket",
      tags: ["Item As Described"],
    },
    {
      id: 3,
      date: "August 18, 2024",
      text: "Shipped same day, arrived fast and packaging was great to ensure item didn’t get damaged. Perfect.",
      brand: "Balenciaga",
      title: "Le Cagole Coin Purse with Piercings",
      tags: ["Fast Shipper", "Item As Described"],
    },
  ];

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
            {/* Sidebar */}
            <GridItem colSpan={2}>
              <SellerSidebar active="FEEDBACK" />
            </GridItem>

            {/* Main Content */}
            <GridItem colSpan={10}>
              <VStack align="start" spacing={10} w="full">
                {/* Seller Score Section */}
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  w="full"
                  p={6}
                  borderRadius="md"
                >
                  <VStack spacing={2} align="center" textAlign="center">
                    <Text fontWeight="bold" fontSize="xl">
                      Seller Score
                    </Text>
                    <HStack spacing={1}>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FaStar} color="#DCEF31" boxSize={4} />
                      ))}
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      16 Reviews
                    </Text>
                    <HStack spacing={3} pt={2}>
                      <Button size="sm" variant="outline" fontSize="sm">
                        Fast Shipper
                      </Button>
                      <Button size="sm" variant="outline" fontSize="sm">
                        Item As Described
                      </Button>
                      <Button size="sm" variant="outline" fontSize="sm">
                        Quick Replies
                      </Button>
                    </HStack>
                  </VStack>
                </Box>

                {/* Feedback Entries */}
                {feedback.map((f, index) => (
                  <Box
                    key={f.id}
                    w="full"
                    display="flex"
                    justifyContent="center"
                  >
                    <Box w="700px">
                      <Flex justify="space-between" align="flex-start">
                        {/* Left column */}
                        <VStack
                          align="start"
                          spacing={3}
                          maxW="calc(100% - 120px)"
                        >
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.800"
                          >
                            {f.date}
                          </Text>

                          <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                as={FaStar}
                                color="#DCEF31"
                                boxSize={3}
                              />
                            ))}
                          </HStack>

                          <Text fontSize="sm">{f.text}</Text>

                          <HStack spacing={2} wrap="wrap">
                            {f.tags.map((tag) => (
                              <Button
                                key={tag}
                                size="xs"
                                variant="outline"
                                color="gray.600"
                                fontSize="xs"
                              >
                                {tag}
                              </Button>
                            ))}
                          </HStack>

                          {/* Brand + Title */}
                          {f.brand && f.title && (
                            <VStack align="start" spacing={0} pt={2}>
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                textDecoration="underline"
                                textTransform="uppercase"
                              >
                                {f.brand}
                              </Text>
                              <Text fontSize="xs">{f.title}</Text>
                            </VStack>
                          )}
                        </VStack>

                        {/* Placeholder Box for Image */}
                        <Box
                          w="100px"
                          h="100px"
                          bg="gray.200"
                          borderRadius="md"
                          ml={4}
                          flexShrink={0}
                        />
                      </Flex>

                      {index < feedback.length - 1 && <Divider my={6} />}
                    </Box>
                  </Box>
                ))}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
