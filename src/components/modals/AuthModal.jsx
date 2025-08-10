import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  VStack,
  HStack,
  Divider,
  Text,
  Link,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../shared/PasswordInput";
import validator from "validator";
import useAuthStore from "../../store/authStore";

export default function AuthModal({
  finalFocusRef,
  isOpen,
  onClose,
  view = "login",
  setView,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage("");

    if (name === "username") {
      const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isValidUsername =
    validator.isAlphanumeric(formData.username) &&
    formData.username.length >= 3 &&
    formData.username.length <= 30;

  const isValidEmail = validator.isEmail(formData.email);

  const isStrongPassword = validator.isStrongPassword(formData.password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  const isFormValid =
    isValidEmail && isStrongPassword && (view === "login" || isValidUsername);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/auth/${view}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.accessToken);

        onClose();
      } else {
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Network error. Please try again.");
    }

    setLoading(false);
  };

  const toggleView = () => {
    setView(view === "login" ? "register" : "login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      finalFocusRef={finalFocusRef}
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="none">
        <ModalHeader textAlign="center">
          {view === "login" ? "Log in" : "Create an account"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {view === "register" && (
              <>
                <Input
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                />
                <AnimatePresence mode="wait">
                  {focusedField === "username" && (
                    <motion.div
                      key="username-helper"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text
                        fontSize="xs"
                        color={!isValidUsername ? "red.500" : "gray.500"}
                      >
                        3–30 characters, letters and numbers only
                      </Text>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <Input
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
            <AnimatePresence mode="wait">
              {focusedField === "email" && (
                <motion.div
                  key="email-helper"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Text
                    fontSize="xs"
                    color={!isValidEmail ? "red.500" : "gray.500"}
                  >
                    Enter a valid email address
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            <PasswordInput
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid && !loading) {
                  handleSubmit();
                }
              }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />

            <AnimatePresence mode="wait">
              {focusedField === "password" && (
                <motion.div
                  key="password-helper"
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Text
                    fontSize="xs"
                    color={!isStrongPassword ? "red.500" : "gray.500"}
                  >
                    Minimum 6 characters, one uppercase, one number, and one
                    symbol
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            {view === "login" && (
              <Text fontSize="sm" color="gray.500" textAlign="right">
                <Link
                  onClick={() => {
                    onClose();
                    navigate("/forgot-password");
                  }}
                >
                  Forgot password?
                </Link>
              </Text>
            )}

            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  key={errorMessage}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <Text fontSize="sm" color="red.500" textAlign="center">
                    {errorMessage}
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              width="100%"
              colorScheme="blackAlpha"
              onClick={handleSubmit}
              isLoading={loading}
              isDisabled={!isFormValid}
            >
              {view === "login" ? "Log In" : "Sign Up"}
            </Button>

            <HStack mt={4} justify="center" spacing="2">
              <Text fontSize="sm" color="gray.500" textAlign="center">
                {view === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
              </Text>
              <Button
                variant="link"
                colorScheme="blackAlpha"
                onClick={toggleView}
              >
                {view === "login" ? "Sign up" : "Log in"}
              </Button>
            </HStack>

            <HStack align="center" justify="center" my={4}>
              <Divider />
              <Text px={2} fontSize="sm" color="gray.500">
                OR
              </Text>
              <Divider />
            </HStack>

            <Button
              width="100%"
              variant="outline"
              leftIcon={<FcGoogle />}
              as="a"
              href={`/api/auth/google`}
            >
              Continue with Google
            </Button>

            <Button
              w="full"
              bg="black"
              color="white"
              _hover={{ bg: "#2c2c2c" }}
              leftIcon={<FaApple />}
              justifyContent="center"
              fontWeight="semibold"
            >
              Continue with Apple
            </Button>

            <Text mt={4} fontSize={10}>
              By signing up, you agree to the Terms of Service and Privacy
              Policy, including Cookie Use
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
