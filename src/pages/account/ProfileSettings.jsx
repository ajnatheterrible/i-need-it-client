import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Switch,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
} from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import AccountSidebar from "../../components/sidebars/AccountSidebar";

export default function ProfileSettings() {
  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2} as="nav">
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={8}>
            <VStack align="start" spacing={10}>
              <Box w="full">
                <Heading size="md" mb={6}>
                  Profile Settings
                </Heading>

                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input value="amnesia_" isReadOnly />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value="6joey6pereira6@gmail.com" isReadOnly />
                  </FormControl>
                </Grid>

                <FormControl mt={6} maxW="sm">
                  <FormLabel>Location</FormLabel>
                  <Select defaultValue="United States" isReadOnly>
                    <option>United States</option>
                  </Select>
                </FormControl>
              </Box>

              <Box w="full">
                <Heading size="md" mb={6}>
                  Privacy
                </Heading>

                <VStack align="start" spacing={6}>
                  <FormControl display="flex" justifyContent="space-between">
                    <FormLabel m={0}>Make my Favorites public</FormLabel>
                    <Switch defaultChecked />
                  </FormControl>

                  <FormControl display="flex" justifyContent="space-between">
                    <Box>
                      <FormLabel m={0}>Make my Closet public</FormLabel>
                      <Text fontSize="sm" color="gray.500">
                        This includes purchases and pricing.
                      </Text>
                    </Box>
                    <Switch />
                  </FormControl>

                  <FormControl display="flex" justifyContent="space-between">
                    <FormLabel m={0}>Make my Following list public</FormLabel>
                    <Switch defaultChecked />
                  </FormControl>

                  <FormControl display="flex" justifyContent="space-between">
                    <FormLabel m={0}>Make my Followers list public</FormLabel>
                    <Switch defaultChecked />
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </GridItem>

          <GridItem colSpan={2} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
