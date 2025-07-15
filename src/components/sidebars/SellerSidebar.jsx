import { VStack, Link, Divider, Box, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navLinks = [
  {
    section: "MY ITEMS",
    items: [
      { label: "FOR SALE", path: "/for-sale" },
      { label: "SOLD", path: "/sold" },
      { label: "DRAFTS", path: "/drafts" },
    ],
  },
  {
    section: "MY PROFILE",
    items: [
      { label: "FEEDBACK", path: "/feedback" },
      { label: "PAYMENTS", path: "/payments-seller" },
      { label: "SETTINGS", path: "/settings-seller" },
    ],
  },
];

export default function SellerSidebar() {
  const location = useLocation();

  return (
    <VStack align="start" spacing={6} fontSize="xs" fontWeight="semibold">
      {navLinks.map((group, i) => (
        <Box key={i} w="full">
          <Text fontWeight="bold" fontSize="xs" color="gray.500" mb={4}>
            {group.section}
          </Text>
          <VStack align="start" spacing={4}>
            {group.items.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Box key={link.path} position="relative">
                  <Link
                    as={RouterLink}
                    to={link.path}
                    display="inline-block"
                    color={isActive ? "black" : "gray.400"}
                    fontWeight={isActive ? "bold" : "semibold"}
                    _hover={{ color: "black" }}
                    pb="6px"
                  >
                    {link.label}
                  </Link>
                  {isActive && (
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      width="100%"
                      height="2px"
                      bg="black"
                    />
                  )}
                </Box>
              );
            })}
          </VStack>
          {i < navLinks.length - 1 && <Divider mt={4} />}
        </Box>
      ))}
    </VStack>
  );
}
