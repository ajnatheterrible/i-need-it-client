import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function CompleteSignup() {
  const navigate = useNavigate();
  const toast = useToast();

  const { user, login, logout, loadUserFromRefresh } = useAuthStore();
  const token = useAuthStore((s) => s.token);

  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const isValid = /^[a-zA-Z0-9]{3,30}$/.test(username);

  useEffect(() => {
    const fetchUser = async () => {
      await loadUserFromRefresh();
      setHasRefreshed(true);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!hasRefreshed) return;

    if (user && user.username) {
      navigate("/");
    }
  }, [user, hasRefreshed, navigate]);

  useEffect(() => {
    if (!hasRefreshed) return;

    if (user?.signupIncompleteAt) {
      const expiresAt =
        new Date(user.signupIncompleteAt).getTime() + 24 * 60 * 60 * 1000;

      const updateTimeLeft = () => {
        const diff = expiresAt - Date.now();
        setTimeLeft(diff > 0 ? diff : 0);
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [user, hasRefreshed]);

  useEffect(() => {
    if (timeLeft === 0) {
      const handleExpiration = async () => {
        try {
          await fetch("/api/auth/cancel-google-signup", {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          await logout();

          toast({
            title: "Signup expired",
            description: "Please start the signup process again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          navigate("/");
        } catch (err) {
          console.error("Auto-cancel signup failed:", err);
        }
      };

      handleExpiration();
    }
  }, [timeLeft, toast, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/complete-signup", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const user = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Username is taken.");
        setLoading(false);
        return;
      }

      login(user);
      navigate("/");
    } catch (err) {
      console.error("🔥 Frontend fetch error:", err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSignup = async (redirectType = "home") => {
    try {
      await fetch("/api/auth/cancel-google-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await logout();

      if (redirectType === "google") {
        window.location.href = "/api/auth/google";
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Cancel signup error:", err);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" px={4}>
      <Box
        bg="white"
        p={8}
        rounded="xl"
        shadow="lg"
        w="full"
        maxW="lg"
        textAlign="center"
      >
        <Heading size="lg" mb={2}>
          Finish setting up
        </Heading>

        <Text mb={6} color="gray.600">
          Choose your username to complete your account
        </Text>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => {
              const value = e.target.value;
              const filtered = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);
              setUsername(filtered);
            }}
            onFocus={() => setShowHint(true)}
            onBlur={() => !username && setShowHint(false)}
            onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
            isDisabled={loading}
            isInvalid={!isValid && username.length > 0}
          />

          {showHint && (
            <Text
              fontSize="sm"
              color={
                username.length === 0
                  ? "red.500"
                  : isValid
                  ? "gray.500"
                  : "red.500"
              }
              mt={-2}
            >
              3–30 characters, letters and numbers only. No symbols or spaces.
            </Text>
          )}

          <Button
            colorScheme="blue"
            w="full"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!isValid}
          >
            Continue
          </Button>

          <Button
            mt={10}
            variant="ghost"
            size="sm"
            colorScheme="gray"
            onClick={() => handleCancelSignup("google")}
          >
            <Flex align="center" justify="center" gap={1.5}>
              <Text as="span">Not your account?</Text>
              <FcGoogle />
            </Flex>
          </Button>

          {errorMsg && (
            <Text color="red.500" fontSize="sm" mt={-1}>
              {errorMsg}
            </Text>
          )}
        </VStack>
      </Box>

      {timeLeft !== null && (
        <Flex
          position="fixed"
          bottom="20px"
          right="20px"
          align="center"
          gap={2}
          zIndex={9999}
        >
          <IconButton
            icon={<HiOutlineArrowNarrowLeft />}
            variant="ghost"
            size="sm"
            aria-label="Go back"
            onClick={() => handleCancelSignup("home")}
          />
          <Tooltip
            fontSize="xs"
            fontFamily="mono"
            label="Signup expires in"
            placement="top"
            bg="white"
            color="gray.800"
            border="1px solid #E2E8F0"
          >
            <Box
              bg="white"
              color="gray.800"
              border="1px solid #E2E8F0"
              px={3}
              py={1}
              rounded="md"
              fontSize="sm"
              fontFamily="mono"
              opacity={0.85}
              _hover={{ opacity: 1 }}
              boxShadow="md"
            >
              ⏳ {formatTime(timeLeft)}
            </Box>
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
}
