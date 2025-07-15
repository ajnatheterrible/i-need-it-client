import { VStack, Link, Divider, Box } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navLinks = [
  { label: "MESSAGES", path: "/messages" },
  { label: "PURCHASES", path: "/purchases" },
  { divider: true },
  { label: "PROFILE SETTINGS", path: "/profile-settings" },
  { label: "ADDRESSES", path: "/addresses" },
  { label: "MY SIZES", path: "/sizes" },
  { label: "PAYMENTS", path: "/payments" },
  { label: "NOTIFICATIONS", path: "/notifications" },
  { divider: true },
  { label: "HELP", path: "/help" },
];

export default function AccountSidebar() {
  const location = useLocation();

  return (
    <VStack align="start" spacing={4} fontSize="xs" fontWeight="semibold">
      {navLinks.map((link, index) => {
        if (link.divider) return <Divider key={index} />;

        const isActive = location.pathname === link.path;

        return (
          <Box key={link.label} position="relative">
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
  );
}
