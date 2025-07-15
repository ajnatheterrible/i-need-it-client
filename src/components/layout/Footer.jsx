import { Box, Text, Flex, HStack, Link, IconButton } from "@chakra-ui/react";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box py={6} mt={16} px={8}>
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap"
        fontSize="xs"
        fontWeight="medium"
        letterSpacing="wide"
      >
        <HStack spacing={6}>
          <Link as={RouterLink} to="/about" _hover={{ fontWeight: "semibold" }}>
            ABOUT
          </Link>
          <Link
            as={RouterLink}
            to="/privacy"
            _hover={{ fontWeight: "semibold" }}
          >
            PRIVACY
          </Link>
          <Link as={RouterLink} to="/help" _hover={{ fontWeight: "semibold" }}>
            HELP & FAQ
          </Link>
          <Link
            as={RouterLink}
            to="/accessibility"
            _hover={{ fontWeight: "semibold" }}
          >
            ACCESSIBILITY
          </Link>
          <Link
            as={RouterLink}
            to="/contact-us"
            _hover={{ fontWeight: "semibold" }}
          >
            CONTACT
          </Link>
        </HStack>

        <HStack spacing={0}>
          <IconButton
            as="a"
            icon={<FaInstagram />}
            aria-label="Instagram"
            variant="ghost"
            size="md"
            cursor="pointer"
          />
          <IconButton
            as="a"
            icon={<FaYoutube />}
            aria-label="YouTube"
            variant="ghost"
            size="md"
            cursor="pointer"
          />
          <IconButton
            as="a"
            icon={<FaFacebook />}
            aria-label="Facebook"
            variant="ghost"
            size="md"
            cursor="pointer"
          />
          <Text fontSize="xs" fontWeight="medium" letterSpacing="wide" ml={6}>
            I Need It © 2025
          </Text>
        </HStack>
      </Flex>
    </Box>
  );
}
