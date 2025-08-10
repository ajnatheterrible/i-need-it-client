import { Box, Grid, GridItem } from "@chakra-ui/react";

export default function Container({
  children,
  isCheckout = false,
  rightPane = null,
}) {
  if (isCheckout) {
    return (
      <Box width="100%" bg="#FAFAFA">
        <Box maxW="1440px" mx="auto" width="100%">
          <Grid templateColumns="1fr 1fr" minH="100vh" width="100%">
            <GridItem bg="white">
              <Box px={{ base: 4, md: 8, xl: "60px" }} py={10}>
                {children}
              </Box>
            </GridItem>

            <GridItem bg="#FAFAFA">
              <Box px={{ base: 4, md: 8, xl: "60px" }} py={10}>
                {rightPane}
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    );
  }

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
