import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Switch,
  Divider,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar";

const notifications = [
  {
    section: "News & Promotions",
    items: [
      {
        title: "Curated Style",
        description:
          "Be the first to find out about our curated collections, expert picks, and top steals.",
      },
      {
        title: "I Need It Blog Dry Clean Only",
        description:
          "Get an inside look at the blog, featuring approachable style advice, up-to-the-minute news, interviews, cultural coverage and more.",
      },
      {
        title: "I Need It Exclusives",
        description:
          "Stay in the know on special promotions, collaborations, sales, and events.",
      },
    ],
  },
  {
    section: "Your Items & Favorites",
    items: [
      {
        title: "New Messages",
        description: "Notify me when I’ve received a new message.",
      },
      {
        title: "Offer Updates",
        description:
          "Notify me when I’ve received a new offer, my offer has been accepted, or my offer is about to expire.",
      },
      {
        title: "Price Drops",
        description: (
          <>
            Notify me when an item I follow has gone down in price. You can
            manage notifications for individual listings{" "}
            <Link href="#" color="blue.500" textDecor="underline">
              here
            </Link>
            .
          </>
        ),
      },
      {
        title: "Followed Searches",
        description: (
          <>
            Notify me when there are new items that match one of my Followed
            Searches. You can manage your Followed Searches in search.
          </>
        ),
      },
      {
        title: "Shipping Updates",
        description: "Update me on the shipping status of my order.",
      },
      {
        title: "Repost Updates",
        description:
          "Notify me when someone has requested a repost of my recent purchase or an item I follow has been reposted and is now available.",
      },
      {
        title: "Seller Tips and Tools",
        description:
          "Send me tips for selling faster and notify me when my items can be bumped.",
      },
      {
        title: "Authentication",
        description: "Notify me when my listings have been authenticated.",
      },
    ],
  },
];

export default function Notifications() {
  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            <VStack align="start" spacing={10}>
              <Text fontSize="2xl" fontWeight="bold">
                Notifications
              </Text>

              {notifications.map((section, i) => (
                <Box key={i} w="full">
                  <Text fontWeight="semibold" mb={4}>
                    {section.section}
                  </Text>
                  <VStack spacing={6} align="start">
                    {section.items.map((item, idx) => (
                      <Box key={idx} w="full">
                        <HStack justify="space-between" align="start" w="full">
                          <Box>
                            <Text fontWeight="semibold">{item.title}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {item.description}
                            </Text>
                          </Box>
                          <HStack spacing={4}>
                            <HStack>
                              <Text fontSize="sm">Email</Text>
                              <Switch size="sm" />
                            </HStack>
                            <HStack>
                              <Text fontSize="sm">Push notifications</Text>
                              <Switch size="sm" />
                            </HStack>
                          </HStack>
                        </HStack>
                        <Divider my={4} />
                      </Box>
                    ))}
                  </VStack>
                </Box>
              ))}

              <Text fontSize="xs" color="gray.500">
                If you would like to unsubscribe from all communications,{" "}
                <Link href="#" color="blue.500" textDecor="underline">
                  click here
                </Link>
                .
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
