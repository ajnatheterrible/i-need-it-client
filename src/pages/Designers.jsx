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
import { useCallback } from "react";
import Container from "../components/shared/Container";
import designers from "../data/designers";

const featuredNames = [
  "Rick Owens",
  "Raf Simons",
  "Balenciaga",
  "Comme des Garçons",
  "Acronym",
  "Maison Margiela",
];

const logoDesigners = featuredNames.filter((name) => designers.includes(name));

const designersByLetter = designers.reduce((acc, name) => {
  const firstChar = name.charAt(0).toUpperCase();
  const letter = /^[A-Z]$/.test(firstChar) ? firstChar : "#";
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(name);
  return acc;
}, {});

const letters = Object.keys(designersByLetter)
  .sort()
  .reduce((ordered, letter) => {
    if (letter === "#") return ["#", ...ordered];
    return [...ordered, letter];
  }, []);

const SCROLL_OFFSET = 140;

export default function Designers() {
  const handleLetterClick = useCallback((e, letter) => {
    e.preventDefault();
    const el = document.getElementById(letter);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }, []);

  return (
    <Container>
      <VStack align="stretch" spacing={8} py={10}>
        <Center>
          <Text fontSize="3xl" fontWeight="bold">
            Designers
          </Text>
        </Center>

        {!!logoDesigners.length && (
          <SimpleGrid columns={[2, null, 3, 6]} spacing={6} width="100%">
            {logoDesigners.map((designer) => (
              <VStack
                key={designer}
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
        )}

        <Grid
          templateColumns={`repeat(${letters.length}, 1fr)`}
          gap={0}
          pt={4}
          width="100%"
        >
          {letters.map((letter) => (
            <Link
              key={letter}
              href={`#${letter}`}
              fontSize="3xl"
              fontWeight="normal"
              textAlign="center"
              letterSpacing="wide"
              _hover={{ textDecoration: "underline" }}
              onClick={(e) => handleLetterClick(e, letter)}
            >
              {letter}
            </Link>
          ))}
        </Grid>

        <Divider borderColor="gray.300" />

        <HStack justify="space-between" width="100%" wrap="wrap" pt={2}>
          <HStack spacing={6}>
            <Link fontWeight="semibold" color="black" href="#">
              Featured
            </Link>
            <Link
              fontWeight="semibold"
              color="gray.600"
              _hover={{ color: "black" }}
              href="#"
            >
              Popular
            </Link>
            <Link
              fontWeight="semibold"
              color="gray.600"
              _hover={{ color: "black" }}
              href="#"
            >
              All
            </Link>
          </HStack>

          <Box flex="1" maxW="704px" mt={[4, 0]}>
            <Input placeholder="Search designers..." size="sm" />
          </Box>
        </HStack>

        {letters.map((letter) => (
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
              {designersByLetter[letter].map((name) => (
                <Link
                  key={name}
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
  );
}
