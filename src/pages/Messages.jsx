import { Box, Grid, GridItem, Text, VStack, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "../components/shared/Container";
import AccountSidebar from "../components/sidebars/AccountSidebar";
import useAuthStore from "../store/authStore";
import Thread from "../components/ui/Thread";

export default function Messages() {
  const [view, setView] = useState("buy");
  const [threads, setThreads] = useState({ buy: [], sell: [] });
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((s) => s.token);

  const handleMarkRead = (threadId) => {
    setThreads((prev) => ({
      buy: prev.buy.map((t) =>
        t._id === threadId ? { ...t, hasUnread: false } : t
      ),
      sell: prev.sell.map((t) =>
        t._id === threadId ? { ...t, hasUnread: false } : t
      ),
    }));
  };

  useEffect(() => {
    const fetchInbox = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/messages/inbox", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setThreads({
          buy: data.buyThreads || [],
          sell: data.sellThreads || [],
        });
      } catch (err) {
        console.error("Error fetching inbox:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [token]);

  const hasUnreadBuy = threads.buy.some((t) => t.hasUnread);
  const hasUnreadSell = threads.sell.some((t) => t.hasUnread);

  const currentThreads = view === "buy" ? threads.buy : threads.sell;

  return (
    <Container>
      <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
        <GridItem colSpan={2} as="nav">
          <AccountSidebar active="MESSAGES" />
        </GridItem>

        <GridItem colSpan={8} display="flex" flexDirection="column">
          <Grid templateColumns="repeat(10, 1fr)" mb={6} gap={0}>
            <GridItem colSpan={5}>
              <Box
                as="button"
                w="100%"
                py={3}
                fontWeight="bold"
                textAlign="center"
                bg={view === "buy" ? "black" : "gray.200"}
                color={view === "buy" ? "white" : "gray.700"}
                borderBottom={
                  view === "buy" ? "2px solid gray.900" : "1px solid gray.300"
                }
                transition="all 0.2s ease"
                position="relative"
                onClick={() => setView("buy")}
              >
                BUY
                {hasUnreadBuy && (
                  <Box
                    position="absolute"
                    top="50%"
                    right="calc(50% - 70px)"
                    transform="translateY(-50%)"
                    w="8px"
                    h="8px"
                    bg={view === "buy" ? "white" : "black"}
                    borderRadius="full"
                  />
                )}
              </Box>
            </GridItem>

            <GridItem colSpan={5}>
              <Box
                as="button"
                w="100%"
                py={3}
                fontWeight="bold"
                textAlign="center"
                bg={view === "sell" ? "black" : "gray.200"}
                color={view === "sell" ? "white" : "gray.700"}
                borderBottom={
                  view === "sell" ? "2px solid gray.900" : "1px solid gray.300"
                }
                transition="all 0.2s ease"
                position="relative"
                onClick={() => setView("sell")}
              >
                SELL
                {hasUnreadSell && (
                  <Box
                    position="absolute"
                    top="50%"
                    right="calc(50% - 65px)"
                    transform="translateY(-50%)"
                    w="8px"
                    h="8px"
                    bg={view === "sell" ? "white" : "gray.600"}
                    borderRadius="full"
                  />
                )}
              </Box>
            </GridItem>
          </Grid>

          {loading ? (
            <Box
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="full"
            >
              <Spinner size="xl" thickness="4px" color="gray.300" />
            </Box>
          ) : currentThreads.length === 0 ? (
            <motion.div
              style={{ width: "100%", flex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="40vh"
                w="full"
              >
                <Text fontSize="sm" color="gray.500">
                  No {view === "buy" ? "buying" : "selling"} messages yet
                </Text>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              style={{ width: "100%", flex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <VStack align="start" spacing={6} w="full">
                {currentThreads.map((thread) => (
                  <Thread
                    key={thread._id}
                    thread={thread}
                    token={token}
                    view={view}
                    onMarkRead={handleMarkRead}
                  />
                ))}
              </VStack>
            </motion.div>
          )}
        </GridItem>

        <GridItem colSpan={2} />
      </Grid>
    </Container>
  );
}
