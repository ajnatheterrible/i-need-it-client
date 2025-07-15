import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  Badge,
  Button,
  Image,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";

export default function Sold() {
  const sales = [...Array(5)].map((_, i) => ({
    id: i,
    brand: "BALENCIAGA",
    title: "Balenciaga panther mask sunglasses",
    price: "$350.00",
    size: "ONE SIZE",
    date: "April 9, 2025",
    buyer: "Yasmin Weber",
    address: "210 Clarkson Ave #419\nBrooklyn, NY 11226-2270\nUnited States",
    imageUrl: "/placeholder.jpg",
    status: i % 2 === 0 ? "Ready to Ship" : "Paid to your Bank",
  }));

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
              <SellerSidebar active="SOLD" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Sold
                </Text>

                {sales.map((item, index) => (
                  <Box key={item.id} w="full">
                    <Grid
                      templateColumns="2fr 4fr 2fr 3fr 1fr"
                      gap={4}
                      alignItems="start"
                    >
                      <Box position="relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          objectFit="cover"
                          height="100px"
                          borderRadius="md"
                        />
                        <Badge
                          position="absolute"
                          top="2"
                          left="2"
                          fontSize="0.6em"
                          fontWeight="bold"
                          colorScheme="blackAlpha"
                        >
                          Sold
                        </Badge>
                      </Box>

                      <VStack align="start" spacing={1} fontSize="xs">
                        <Text fontWeight="semibold" color="green.600">
                          {item.status}
                        </Text>
                        <Text fontWeight="bold" fontSize="sm">
                          {item.brand}
                        </Text>
                        <Text color="gray.600">{item.title}</Text>
                        <Text fontWeight="semibold" fontSize="sm">
                          {item.price}
                        </Text>
                        <Text color="gray.500">{item.size}</Text>
                      </VStack>

                      <VStack align="start" spacing={1} fontSize="xs">
                        <Text fontWeight="bold" color="gray.600">
                          Sold
                        </Text>
                        <Text color="gray.500">{item.date}</Text>
                      </VStack>

                      <VStack align="start" spacing={1} fontSize="xs">
                        <Text fontWeight="bold" color="gray.600">
                          Shipping Details
                        </Text>
                        <Text color="gray.500">
                          This sale includes a pre-paid label
                        </Text>
                        <Text>{item.buyer}</Text>
                        <Text whiteSpace="pre-wrap">{item.address}</Text>
                      </VStack>

                      <VStack
                        spacing={2}
                        align="stretch"
                        justifyContent="center"
                        pt={6}
                      >
                        <Button
                          size="xs"
                          variant="solid"
                          colorScheme="blackAlpha"
                          fontWeight="semibold"
                          fontSize="xs"
                        >
                          VIEW TRACKING
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          fontWeight="semibold"
                          fontSize="xs"
                        >
                          ORDER DETAILS
                        </Button>
                      </VStack>
                    </Grid>
                    {index < sales.length - 1 && <Divider my={6} />}
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
