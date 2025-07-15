import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  Image,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar"; // 🆕 import sidebar component

export default function Purchases() {
  const purchases = [...Array(5)].map((_, i) => ({
    id: i,
    brand: "THE VIRIDI-ANNE",
    title: "Leather mask hooded jacket",
    price: "$1200.00",
    size: "US 8 / EU 41-42-46",
    date: "April 27, 2025",
    seller: "soya.dg",
    imageUrl: "/placeholder.jpg",
    status: "Delivered",
  }));

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            <VStack align="start" spacing={6}>
              <Text fontSize="4xl" fontWeight="bold">
                Purchases
              </Text>

              {purchases.map((item) => (
                <Box
                  key={item.id}
                  w="full"
                  borderWidth="1px"
                  borderRadius="md"
                  p={4}
                  bg="white"
                >
                  <Grid templateColumns="2fr 5fr 2fr 2fr" gap={4}>
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
                        {item.status.toUpperCase()}
                      </Badge>
                    </Box>

                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        {item.brand}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {item.title}
                      </Text>
                      <Text fontWeight="semibold" fontSize="sm">
                        {item.price}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.size}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={1} fontSize="xs">
                      <Text color="gray.500">Purchased on</Text>
                      <Text>{item.date}</Text>
                      <Text color="gray.500">Seller</Text>
                      <HStack>
                        <Avatar size="xs" name={item.seller} bg="gray.200" />
                        <Link
                          as={RouterLink}
                          to="#"
                          fontWeight="semibold"
                          fontSize="xs"
                        >
                          {item.seller}
                        </Link>
                      </HStack>
                    </VStack>

                    <VStack spacing={2}>
                      <Button size="sm" variant="outline">
                        EDIT FEEDBACK
                      </Button>
                      <Button size="sm" variant="outline">
                        ORDER DETAILS
                      </Button>
                    </VStack>
                  </Grid>
                </Box>
              ))}
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
