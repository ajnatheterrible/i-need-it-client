import { Box, Button, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import validator from "validator";
import useAuthStore from "../../store/authStore";
import ResetRequestForm from "../../components/auth/ResetRequestForm";
import PasswordInput from "../../components/shared/PasswordInput";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  const isStrongPassword = validator.isStrongPassword(newPassword, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const passwordsMatch = newPassword === confirmPassword;

  const isFormValid = isStrongPassword && passwordsMatch;

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) {
          setTokenValid(false);
          setError(data.message);
        }
      } catch (err) {
        setTokenValid(false);
        setError("Something went wrong while validating the token.");
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    if (serverMessage && serverMessage.toLowerCase().includes("successfully")) {
      const timeout = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [serverMessage, navigate]);

  const handleRequestReset = async () => {
    setLoading(true);
    setError("");
    setServerMessage("");

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setServerMessage(data.message);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");
    setServerMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);

        throw new Error(data.message);
      }

      login(data.user, data.accessToken);
      setServerMessage(data.message);
    } catch (err) {
      console.log(err);
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      if (token && tokenValid) {
        if (newPassword && confirmPassword) handleResetPassword();
      } else if (!token || !tokenValid) {
        if (email) handleRequestReset();
      }
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading mb={8} size="lg" textAlign="center">
        {token ? "Reset password" : "Forgot password?"}
      </Heading>

      <VStack spacing={4}>
        {token && !tokenValid ? (
          serverMessage ? (
            <Text textAlign="center" color="green.600">
              {serverMessage}
            </Text>
          ) : (
            <ResetRequestForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              error={error}
              onSubmit={handleRequestReset}
              onKeyDown={handleKeyDown}
            />
          )
        ) : token ? (
          serverMessage ? (
            <Text textAlign="center" color="green.600">
              {serverMessage}
            </Text>
          ) : (
            <>
              <PasswordInput
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
              />
              {focusedField === "newPassword" && (
                <Text
                  fontSize="xs"
                  color={!isStrongPassword ? "red.500" : "gray.500"}
                >
                  Must include uppercase, number, and symbol (min 6 characters)
                </Text>
              )}

              <PasswordInput
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
              />
              {focusedField === "confirmPassword" && (
                <Text
                  fontSize="xs"
                  color={!passwordsMatch ? "red.500" : "gray.500"}
                >
                  Must match the password above
                </Text>
              )}

              <Button
                colorScheme="blackAlpha"
                onClick={handleResetPassword}
                isLoading={loading}
                isDisabled={!isFormValid}
              >
                RESET
              </Button>
            </>
          )
        ) : serverMessage ? (
          <Text textAlign="center" color="green.600">
            ✉️ {serverMessage}
          </Text>
        ) : (
          <ResetRequestForm
            email={email}
            setEmail={setEmail}
            loading={loading}
            error={error}
            onSubmit={handleRequestReset}
            onKeyDown={handleKeyDown}
          />
        )}
      </VStack>
    </Box>
  );
}
