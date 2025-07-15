import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import AccountSidebar from "../components/sidebars/AccountSidebar";

export default function Messages() {
  const [view, setView] = useState("buy");
  const [expandedId, setExpandedId] = useState(null);

  const activeBg = useColorModeValue("black", "white");
  const activeColor = useColorModeValue("white", "black");
  const inactiveBg = useColorModeValue("gray.100", "gray.800");

  const messages = [...Array(5)].map((_, i) => ({
    id: i,
    designer: "RICK OWENS",
    item: "Rick Owens leather tyrone pants",
    snippet: "Please read! I’ve told you that I’d...",
    date: "1 day ago",
    user: "rickoboy69",
    feedback: 129,
  }));

  const dummyThread = [
    {
      sender: "them",
      text: "Hey, is this still available?",
      timestamp: "2d ago",
    },
    { sender: "me", text: "Yeah, still available", timestamp: "2d ago" },
    { sender: "them", text: "Would you take $400?", timestamp: "1d ago" },
    { sender: "me", text: "Can’t do that. Firm at $500.", timestamp: "1d ago" },
  ];

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2} as="nav">
            <AccountSidebar active="MESSAGES" />
          </GridItem>

          <GridItem colSpan={8}>
            <Grid templateColumns="repeat(10, 1fr)" mb={6} gap={2}>
              <GridItem colSpan={5}>
                <Box
                  as="button"
                  w="100%"
                  py={3}
                  fontWeight="bold"
                  textAlign="center"
                  bg={view === "buy" ? activeBg : inactiveBg}
                  color={view === "buy" ? activeColor : "inherit"}
                  onClick={() => {
                    setView("buy");
                    setExpandedId(null);
                  }}
                >
                  BUY MESSAGES
                </Box>
              </GridItem>
              <GridItem colSpan={5}>
                <Box
                  as="button"
                  w="100%"
                  py={3}
                  fontWeight="bold"
                  textAlign="center"
                  bg={view === "sell" ? activeBg : inactiveBg}
                  color={view === "sell" ? activeColor : "inherit"}
                  onClick={() => {
                    setView("sell");
                    setExpandedId(null);
                  }}
                >
                  SELL MESSAGES
                </Box>
              </GridItem>
            </Grid>

            <VStack align="start" spacing={6}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  w="full"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                  onClick={() =>
                    setExpandedId(expandedId === msg.id ? null : msg.id)
                  }
                  cursor="pointer"
                  transition="background 0.2s"
                >
                  <HStack
                    spacing={6}
                    w="full"
                    justify="space-between"
                    align="center"
                    p={4}
                    borderBottom={
                      expandedId === msg.id ? "1px solid gray.200" : "none"
                    }
                  >
                    <HStack spacing={4} minW="240px">
                      <Avatar
                        size="md"
                        name={msg.designer}
                        bg="gray.200"
                        color="gray.700"
                      />
                      <VStack spacing={1} align="start">
                        <Text fontWeight="bold" fontSize="sm">
                          {msg.designer}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {msg.item}
                        </Text>
                      </VStack>
                    </HStack>

                    <Box flex="1" px={4}>
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        noOfLines={1}
                        textAlign="left"
                      >
                        {msg.snippet}
                      </Text>
                    </Box>

                    <Box textAlign="right" minW="90px">
                      <Text fontSize="xs" color="gray.500">
                        {msg.date}
                        <br />
                        <Box as="span" fontWeight="semibold" color="gray.700">
                          {msg.user} ({msg.feedback})
                        </Box>
                      </Text>
                    </Box>
                  </HStack>

                  {expandedId === msg.id && (
                    <Box px={6} py={4}>
                      {dummyThread.map((m, i) => (
                        <Box key={i} mb={3}>
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={m.sender === "me" ? "black" : "gray.700"}
                          >
                            {m.sender === "me" ? "You" : msg.user}
                          </Text>
                          <Text fontSize="sm" mb={1}>
                            {m.text}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {m.timestamp}
                          </Text>
                        </Box>
                      ))}
                      <Button size="sm" mt={4}>
                        Reply
                      </Button>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          </GridItem>

          <GridItem colSpan={2} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
