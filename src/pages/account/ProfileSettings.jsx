import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Switch,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import useAuthStore from "../../store/authStore";
import { useState, useEffect } from "react";

import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import AccountSidebar from "../../components/sidebars/AccountSidebar";
import CustomSelect from "../../components/ui/CustomSelect";

import useFetchUserSettings from "../../hooks/useFetchUserSettings";

export default function ProfileSettings() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const storeLocation = useAuthStore(
    (s) => s.fetchedData.userSettings?.location
  );
  const storeFavoritesPublic = useAuthStore(
    (s) => s.fetchedData.userSettings?.favoritesPublic
  );
  const storeClosetPublic = useAuthStore(
    (s) => s.fetchedData.userSettings?.closetPublic
  );
  const storeFollowingPublic = useAuthStore(
    (s) => s.fetchedData.userSettings?.followingPublic
  );
  const storeFollowersPublic = useAuthStore(
    (s) => s.fetchedData.userSettings?.followersPublic
  );

  const [email, setEmail] = useState(user.email || "");
  const [username, setUsername] = useState(user.username || "");
  const [debouncedUsername, setDebouncedUsername] = useState(username);
  const [debouncedEmail, setDebouncedEmail] = useState(email);
  const [location, setLocation] = useState("United States");
  const [favoritesPublic, setFavoritesPublic] = useState(true);
  const [closetPublic, setClosetPublic] = useState(false);
  const [followingPublic, setFollowingPublic] = useState(true);
  const [followersPublic, setFollowersPublic] = useState(true);

  const [emailError, setEmailError] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const { loading, error } = useFetchUserSettings();

  useEffect(() => {
    if (storeLocation !== undefined) {
      setLocation(storeLocation);
    }
    if (storeFavoritesPublic !== undefined) {
      setFavoritesPublic(storeFavoritesPublic);
    }
    if (storeClosetPublic !== undefined) {
      setClosetPublic(storeClosetPublic);
    }
    if (storeFollowingPublic !== undefined) {
      setFollowingPublic(storeFollowingPublic);
    }
    if (storeFollowersPublic !== undefined) {
      setFollowersPublic(storeFollowersPublic);
    }
  }, [
    storeLocation,
    storeFavoritesPublic,
    storeClosetPublic,
    storeFollowingPublic,
    storeFollowersPublic,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 200);

    return () => clearTimeout(handler);
  }, [username]);

  useEffect(() => {
    if (!username) {
      setUsernameMessage("");
      setUsernameError(false);
    }
  }, [username]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedUsername) return;

      if (debouncedUsername === user.username) {
        setUsernameMessage("");
        setUsernameError(false);
        return;
      }

      if (debouncedUsername.length < 3) {
        setUsernameMessage(" 3–30 characters, letters and numbers only");
        setUsernameError(true);

        return;
      }

      try {
        setCheckingUsername(true);

        const res = await fetch(
          `/api/users/is-username-available?username=${encodeURIComponent(
            debouncedUsername
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUsernameMessage(data.message);
          setUsernameError(false);
        } else {
          setUsernameMessage(data.message);
        }
      } catch (err) {
        console.error("Error checking username availability", err);
        setUsernameMessage("Error checking username availability");
      } finally {
        setCheckingUsername(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername, user]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(email.trim());
    }, 200);

    return () => clearTimeout(handler);
  }, [email]);

  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (!debouncedEmail) {
        setEmailError(false);
        setEmailMessage("");
        return;
      }

      if (!isValidEmail(debouncedEmail)) {
        setEmailError(true);
        setEmailMessage("Please enter a valid email address");
        return;
      }

      if (debouncedEmail === user.email) {
        setEmailError(false);
        setEmailMessage("");
        return;
      }

      try {
        setCheckingEmail(true);

        const res = await fetch(
          `/api/users/is-email-available?email=${encodeURIComponent(
            debouncedEmail
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          if (data.available) {
            setEmailError(false);
            setEmailMessage("");
          } else {
            setEmailError(true);
            setEmailMessage(data.message || "This email cannot be used");
          }
        } else {
          setEmailError(true);
          setEmailMessage(data.message || "Something went wrong");
        }
      } catch (err) {
        setEmailError(true);
        setEmailMessage("Could not verify email. Please try again.");
      } finally {
        setCheckingEmail(false);
      }
    };

    checkEmailAvailability();
  }, [debouncedEmail]);

  const handleSave = async () => {
    if (usernameError || emailError) return;

    const updateRequests = [];

    const usernameReq =
      username !== user.username
        ? {
            key: "username",
            req: fetch("/api/users/update-username", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ username }),
            }),
          }
        : null;

    const emailReq =
      email !== user.email
        ? {
            key: "email",
            req: fetch("/api/users/request-email-change", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ newEmail: email }),
            }),
          }
        : null;

    const privacyUnchanged =
      location === storeLocation &&
      favoritesPublic === storeFavoritesPublic &&
      closetPublic === storeClosetPublic &&
      followersPublic === storeFollowersPublic &&
      followingPublic === storeFollowingPublic;

    const privacyReq = !privacyUnchanged
      ? {
          key: "privacy",
          req: fetch("/api/users/update-privacy-settings", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              location,
              privacy: {
                favoritesPublic,
                closetPublic,
                followersPublic,
                followingPublic,
              },
            }),
          }),
        }
      : null;

    if (usernameReq) updateRequests.push(usernameReq);
    if (emailReq) updateRequests.push(emailReq);
    if (privacyReq) updateRequests.push(privacyReq);

    if (updateRequests.length === 0) return;

    setSubmitting(true);

    try {
      const results = await Promise.all(
        updateRequests.map(async ({ key, req }) => {
          try {
            const res = await req;
            const json = await res.json();

            if (!res.ok) {
              return { key, error: json.message || "Something went wrong" };
            }

            return { key, success: true, user: json.user || null };
          } catch (err) {
            console.error(`Unexpected error for ${key}:`, err);
            return { key, error: "Unexpected error occurred." };
          }
        })
      );

      let updatedUser = null;

      for (const result of results) {
        if (result.success) {
          if (result.user) {
            updatedUser = result.user;
          }

          if (result.key === "email") {
            setEmailError(false);
            setEmailMessage(
              "Verification email sent. Please confirm via your inbox."
            );
          }
        } else if (result.error) {
          if (result.key === "username") {
            setUsernameError(true);
            setUsernameMessage(result.error);
          } else if (result.key === "email") {
            setEmailError(true);
            setEmailMessage(result.error);
          } else if (result.key === "privacy") {
            console.error("Privacy update failed:", result.error);
          }
        }
      }

      if (updatedUser) {
        useAuthStore.setState({ user: updatedUser });
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (err) {
      console.error("Unexpected error during save:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={6} py={10}>
          <GridItem colSpan={2} as="nav">
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={8}>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="80vh"
                w="full"
              >
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <VStack align="start" spacing={10}>
                  <Box w="full">
                    <Heading size="md" mb={6}>
                      Profile Settings
                    </Heading>
                    <FormControl mt={6} maxW="sm">
                      <FormLabel>Username</FormLabel>
                      <HStack>
                        <Input
                          borderColor={
                            usernameMessage &&
                            (usernameMessage.includes("taken") ||
                              usernameMessage.includes("30"))
                              ? "red.500"
                              : "gray.200"
                          }
                          value={username}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (/^[a-zA-Z0-9]{0,30}$/.test(input)) {
                              setUsername(input);
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value.length === 0) {
                              setUsername(user.username);
                            }
                          }}
                        />
                        {checkingUsername && (
                          <Spinner size="xs" color="gray.400" ml={2} />
                        )}
                      </HStack>
                    </FormControl>

                    <AnimatePresence mode="wait">
                      {usernameMessage && (
                        <motion.div
                          key={usernameMessage}
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Text
                            mt={3}
                            fontSize="xs"
                            fontWeight="bold"
                            color={
                              usernameMessage.includes("available")
                                ? "green.500"
                                : "red.500"
                            }
                          >
                            {usernameMessage}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FormControl mt={6} maxW="sm">
                      <FormLabel>Email</FormLabel>
                      <HStack>
                        <Input
                          borderColor={emailError ? "red.500" : "gray.200"}
                          value={email}
                          onChange={(e) => {
                            const input = e.target.value;
                            setEmail(input);

                            if (input.trim().length === 0) {
                              setEmailError(false);
                              return;
                            }

                            if (isValidEmail(input.trim())) {
                              setEmailError(false);
                            } else {
                              setEmailError(true);
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.trim();

                            if (value.length === 0) {
                              setEmail(user.email);
                              setEmailError(false);
                            } else {
                              setEmail(value);
                            }
                          }}
                        />
                        {checkingEmail && (
                          <Spinner size="xs" color="gray.400" ml={2} />
                        )}
                      </HStack>
                    </FormControl>

                    <AnimatePresence mode="wait">
                      {emailMessage && (
                        <motion.div
                          key={emailMessage}
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Text
                            color={emailError ? "red.500" : "green.500"}
                            fontSize="xs"
                            fontWeight="bold"
                            mt={3}
                          >
                            {emailMessage}
                          </Text>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FormControl mt={6} maxW="sm">
                      <FormLabel>Location</FormLabel>
                      <CustomSelect
                        id="location"
                        placeholder="Select your region"
                        options={[
                          "United States",
                          "Canada",
                          "United Kingdom",
                          "Europe",
                          "Asia",
                          "Australia / NZ",
                          "Other",
                        ]}
                        value={location}
                        onChange={(val) => setLocation(val)}
                      />
                    </FormControl>
                  </Box>

                  <Box w="full">
                    <Heading size="md" mb={6}>
                      Privacy
                    </Heading>

                    <VStack align="start" spacing={6}>
                      <FormControl
                        display="flex"
                        justifyContent="space-between"
                      >
                        <FormLabel m={0}>Make my Favorites public</FormLabel>
                        <Switch
                          isChecked={favoritesPublic}
                          onChange={() => {
                            setFavoritesPublic((prev) => !prev);
                          }}
                          colorScheme="blackAlpha"
                        />
                      </FormControl>

                      <FormControl
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Box>
                          <FormLabel m={0}>Make my Closet public</FormLabel>
                          <Text fontSize="sm" color="gray.500">
                            This includes purchases and pricing.
                          </Text>
                        </Box>
                        <Switch
                          isChecked={closetPublic}
                          onChange={() => {
                            setClosetPublic((prev) => !prev);
                          }}
                          colorScheme="blackAlpha"
                        />
                      </FormControl>

                      <FormControl
                        display="flex"
                        justifyContent="space-between"
                      >
                        <FormLabel m={0}>
                          Make my Following list public
                        </FormLabel>
                        <Switch
                          isChecked={followingPublic}
                          onChange={() => {
                            setFollowingPublic((prev) => !prev);
                          }}
                          colorScheme="blackAlpha"
                        />
                      </FormControl>

                      <FormControl
                        display="flex"
                        justifyContent="space-between"
                      >
                        <FormLabel m={0}>
                          Make my Followers list public
                        </FormLabel>
                        <Switch
                          isChecked={followersPublic}
                          onChange={() => {
                            setFollowersPublic((prev) => !prev);
                          }}
                          colorScheme="blackAlpha"
                        />
                      </FormControl>
                    </VStack>
                  </Box>
                  <Button
                    mt={4}
                    w="full"
                    colorScheme="blackAlpha"
                    bg="black"
                    color="white"
                    onClick={handleSave}
                    isLoading={submitting}
                    isDisabled={emailError || usernameError}
                  >
                    SAVE CHANGES
                  </Button>
                </VStack>
              </motion.div>
            )}
            <Box
              w="full"
              display="flex"
              justifyContent="center"
              minH="24px"
              mt={3}
            >
              <AnimatePresence mode="wait">
                {showSuccessMessage && (
                  <motion.div
                    key="profile-success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Text color="green.500" fontSize="sm" fontWeight="bold">
                      Changes saved
                    </Text>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </GridItem>

          <GridItem colSpan={2} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
