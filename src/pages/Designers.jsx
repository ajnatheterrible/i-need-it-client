import {
  Box,
  Grid,
  Text,
  VStack,
  HStack,
  Input,
  Divider,
  Link,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";

const logoDesigners = [
  "Rick Owens",
  "Raf Simons",
  "Balenciaga",
  "Comme des Garçons",
  "Acronym",
  "Maison Margiela",
];

const alphabet = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

const designersByLetter = alphabet.reduce((acc, letter) => {
  acc[letter] = Array.from(
    { length: 30 },
    (_, i) => `${letter} Designer ${i + 1}`
  );
  return acc;
}, {});

export default function Designers() {
  return (
    <>
      <Container>
        <VStack align="stretch" spacing={8} py={10}>
          <Center>
            <Text fontSize="3xl" fontWeight="bold">
              Designers
            </Text>
          </Center>

          <SimpleGrid columns={[2, null, 3, 6]} spacing={6} width="100%">
            {logoDesigners.map((designer, i) => (
              <VStack
                key={i}
                spacing={2}
                p={4}
                borderRadius="md"
                bg="gray.50"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
              >
                <Box bg="gray.300" w="56px" h="56px" borderRadius="full" />
                <Text fontSize="sm" textAlign="center">
                  <Link href="#">{designer}</Link>
                </Text>
              </VStack>
            ))}
          </SimpleGrid>

          <Grid templateColumns="repeat(27, 1fr)" gap={0} pt={4} width="100%">
            {alphabet.map((letter) => (
              <Link
                key={letter}
                href={`#${letter}`}
                fontSize="3xl"
                fontWeight="normal"
                textAlign="center"
                letterSpacing="wide"
                _hover={{ textDecoration: "underline" }}
              >
                {letter}
              </Link>
            ))}
          </Grid>

          <Divider borderColor="gray.300" />

          <HStack justify="space-between" width="100%" wrap="wrap" pt={2}>
            <HStack spacing={6}>
              <Link fontWeight="semibold" color="black">
                Featured
              </Link>
              <Link
                fontWeight="semibold"
                color="gray.600"
                _hover={{ color: "black" }}
              >
                Popular
              </Link>
              <Link
                fontWeight="semibold"
                color="gray.600"
                _hover={{ color: "black" }}
              >
                All
              </Link>
            </HStack>

            <Box flex="1" maxW="704px" mt={[4, 0]}>
              <Input placeholder="Search designers..." size="sm" />
            </Box>
          </HStack>

          {alphabet.map((letter) => (
            <HStack
              key={letter}
              align="flex-start"
              spacing={36}
              pt={10}
              id={letter}
            >
              <Box minW="40px">
                <Text fontSize="6xl" fontWeight="normal">
                  {letter}
                </Text>
              </Box>

              <SimpleGrid columns={[1, 2, 3]} spacingY={2} flex="1">
                {designersByLetter[letter].map((name, i) => (
                  <Link
                    key={i}
                    href="#"
                    fontSize="sm"
                    color="gray.800"
                    _hover={{ textDecoration: "underline" }}
                  >
                    {name}
                  </Link>
                ))}
              </SimpleGrid>
            </HStack>
          ))}
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
