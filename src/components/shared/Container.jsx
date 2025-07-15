import { Box } from "@chakra-ui/react";

export default function Container({ children }) {
  return (
    <Box
      width="100%"
      maxW="1440px"
      px={{ base: 4, md: 8, xl: "120px" }}
      mx="auto"
    >
      {children}
    </Box>
  );
}
