import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Spinner, Text, Icon, VStack, Center } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import useAuthStore from "../../store/authStore";

const MotionVStack = motion(VStack);

export default function ConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let didRun = false;
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("This link has already been used or has expired");
      return;
    }

    const confirm = async () => {
      if (didRun) return;
      didRun = true;

      try {
        const res = await fetch(
          `/api/users/confirm-email-change?token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been updated successfully");
          logout();
        } else {
          setStatus("error");
          setMessage(data.message || "Something went wrong.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unexpected error occurred.");
      }
    };

    confirm();
  }, [searchParams]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <Center>
          <Spinner size="xl" thickness="4px" color="gray.400" />
        </Center>
      );
    }

    const isSuccess = status === "success";
    const IconComp = isSuccess ? CheckCircleIcon : WarningIcon;
    const iconColor = isSuccess ? "green.400" : "red.400";

    return (
      <MotionVStack
        spacing={6}
        textAlign="center"
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 3 }}
        transition={{ duration: 0.2 }}
      >
        <Icon as={IconComp} boxSize={16} color={iconColor} />

        <motion.div
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          transition={{ duration: 0.2 }}
        >
          <Text fontSize="lg" fontWeight="semibold">
            {message}
          </Text>
        </motion.div>

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.2 }}
          >
            <Text>You may now log in with your new email</Text>
          </motion.div>
        )}
      </MotionVStack>
    );
  };

  return (
    <Box minH="80vh" display="flex" flexDirection="column">
      <Box flex="1">
        <Container>
          <Box
            maxW="md"
            mx="auto"
            mt={20}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
          >
            {renderContent()}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
