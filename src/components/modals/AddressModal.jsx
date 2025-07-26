import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  Box,
  GridItem,
  Checkbox,
  Button,
  Text,
  Tooltip,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from "framer-motion";

import { useState, useRef, useEffect } from "react";

import useAuthStore from "../../store/authStore";
import countries from "../../data/countries";

export default function AddressModal({
  isOpen,
  onClose,
  mode = "add",
  existingAddress = null,
  onDelete,
  isDeleting,
}) {
  const [formData, setFormData] = useState(
    () =>
      existingAddress || {
        fullName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        phone: "",
        isDefaultShipping: false,
        isDefaultPurchase: false,
      }
  );
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryInput, setCountryInput] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);

  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const filteredCountries = countryInput
    ? countries
        .filter((c) =>
          c.toLowerCase().includes(countryInput.trim().toLowerCase())
        )
        .slice(0, 10)
    : countries;

  const sanitizeTextInput = (value, max = 40) =>
    value.replace(/[^a-zA-Z\s.'-]/g, "").slice(0, max);

  const sanitizePostal = (value, max = 12) =>
    value.replace(/[^a-zA-Z0-9\s-]/g, "").slice(0, max);

  const sanitizeStreetInput = (value, max = 60) =>
    value.replace(/[^a-zA-Z0-9\s.,'#/\\-]/g, "").slice(0, max);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let sanitizedValue = value;

    if (type === "checkbox") {
      sanitizedValue = checked;
    } else {
      if (name === "phone") {
        sanitizedValue = value.replace(/[^\d\s\-()+]/g, "").slice(0, 20);
      } else if (["fullName", "city", "state"].includes(name)) {
        sanitizedValue = sanitizeTextInput(value);
      } else if (name === "zip") {
        sanitizedValue = sanitizePostal(value);
      } else if (["line1", "line2"].includes(name)) {
        sanitizedValue = sanitizeStreetInput(value);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.line1) newErrors.line1 = "Required";
    if (!formData.city) newErrors.city = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.country) newErrors.country = "Required";
    if (!formData.zip) newErrors.zip = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    const isEqual =
      JSON.stringify(formData) === JSON.stringify(existingAddress);

    if (isEqual) {
      onClose();
      return;
    }

    if (validate()) {
      try {
        setLoading(true);

        const endpoint =
          mode === "edit"
            ? `/api/users/addresses/${existingAddress._id}`
            : "/api/users/addresses";
        const method = mode === "edit" ? "PUT" : "POST";

        const res = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setFetchedData({ addresses: data });
        onClose();
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData(
        existingAddress || {
          fullName: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "",
          zip: "",
          phone: "",
          isDefaultShipping: false,
        }
      );
    }
  }, [existingAddress, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent borderRadius="none">
        <ModalHeader fontWeight="bold" fontSize="xl" textAlign="center">
          {mode === "edit" ? "Edit address" : "Add address"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mb={4} isInvalid={touched.fullName && errors.fullName}>
            <FormLabel fontSize="xs" fontWeight="semibold">
              Legal Name
            </FormLabel>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => handleBlur("fullName")}
              fontSize="sm"
            />
            <Text fontSize="xs" mt={2} color="gray.500" bg="gray.50" p={3}>
              Enter your full legal name as written on a government-issued ID.
              Your account and/or cash outs may be suspended if your identity
              cannot be verified.
            </Text>
          </FormControl>

          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={12}>
              <FormControl isInvalid={touched.line1 && errors.line1}>
                <FormLabel
                  display="flex"
                  alignItems="center"
                  fontSize="xs"
                  fontWeight="semibold"
                  gap={1}
                >
                  Street Address
                  <Tooltip
                    label="This must match your government ID"
                    bg="gray.50"
                    color="gray.500"
                    borderRadius="md"
                    fontSize="xs"
                  >
                    <WarningTwoIcon color="orange.400" boxSize={3} />
                  </Tooltip>
                </FormLabel>
                <Input
                  name="line1"
                  fontSize="sm"
                  value={formData.line1}
                  onChange={handleChange}
                  onBlur={() => handleBlur("line1")}
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  Apt/Suite
                </FormLabel>
                <Input
                  name="line2"
                  value={formData.line2}
                  onChange={handleChange}
                  fontSize="sm"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  Phone #
                </FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fontSize="sm"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl isInvalid={touched.city && errors.city}>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  City
                </FormLabel>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur("city")}
                  fontSize="sm"
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl isInvalid={touched.state && errors.state}>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  State/Prov.
                </FormLabel>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={() => handleBlur("state")}
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl isInvalid={touched.country && errors.country}>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  Country
                </FormLabel>
                <Input
                  fontSize="sm"
                  ref={inputRef}
                  value={countryInput}
                  onChange={(e) => {
                    setCountryInput(e.target.value);
                    setShowCountryDropdown(true);
                    setActiveIndex(0); // reset index on input change
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  onBlur={() => {
                    handleBlur("country");
                    setTimeout(() => {
                      setShowCountryDropdown(false);
                      if (!filteredCountries.includes(countryInput)) {
                        setCountryInput("");
                        setFormData((prev) => ({ ...prev, country: "" }));
                      }
                    }, 100);
                  }}
                  onKeyDown={(e) => {
                    if (!showCountryDropdown || filteredCountries.length === 0)
                      return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev === filteredCountries.length - 1 ? 0 : prev + 1
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev === 0 ? filteredCountries.length - 1 : prev - 1
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      const selected = filteredCountries[activeIndex];
                      if (selected) {
                        setCountryInput(selected);
                        setFormData((prev) => ({ ...prev, country: selected }));
                        setShowCountryDropdown(false);
                      }
                    }
                  }}
                  borderWidth="1px"
                />

                <AnimatePresence>
                  {showCountryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        width: inputRef.current?.offsetWidth ?? "100%",
                        zIndex: 20,
                      }}
                    >
                      <Box
                        bg="white"
                        border="1px solid #E2E8F0"
                        mt={2}
                        maxH="200px"
                        overflowY="auto"
                        borderRadius="md"
                        boxShadow="md"
                      >
                        {filteredCountries.map((c, idx) => (
                          <Box
                            key={c}
                            px={4}
                            py={2}
                            bg={idx === activeIndex ? "gray.100" : "white"}
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            onMouseDown={() => {
                              setCountryInput(c);
                              setFormData((prev) => ({ ...prev, country: c }));
                              setShowCountryDropdown(false);
                            }}
                            fontSize="sm"
                          >
                            {c}
                          </Box>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem colSpan={6}>
              <FormControl isInvalid={touched.zip && errors.zip}>
                <FormLabel fontSize="xs" fontWeight="semibold">
                  Postal Code
                </FormLabel>
                <Input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  onBlur={() => handleBlur("zip")}
                  fontSize="sm"
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          <VStack mt={8} spacing={4} align="start">
            <Checkbox
              name="isDefaultShipping"
              isChecked={formData.isDefaultShipping}
              onChange={handleChange}
              fontSize="xs"
            >
              <Text fontSize="xs">Make this my Default Return Address</Text>
            </Checkbox>

            <Checkbox
              name="isDefaultPurchase"
              isChecked={formData.isDefaultPurchase}
              onChange={handleChange}
              fontSize="xs"
            >
              <Text fontSize="xs">Make this my Default Purchase Address</Text>
            </Checkbox>
          </VStack>
        </ModalBody>

        <ModalFooter display="block">
          <Button
            bg="black"
            color="white"
            size="md"
            w="full"
            fontWeight="semibold"
            fontSize="sm"
            borderRadius="none"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={isDeleting}
          >
            {mode === "edit" ? "SAVE CHANGES" : "SAVE ADDRESS"}
          </Button>
          {mode === "edit" && (
            <Button
              mt={1}
              isLoading={isDeleting}
              onClick={async () => {
                await onDelete?.(existingAddress._id);
                onClose();
              }}
              colorScheme="red"
              variant="ghost"
              fontSize="sm"
              fontWeight="semibold"
              w="full"
              isDisabled={loading}
            >
              DELETE
            </Button>
          )}
        </ModalFooter>
        {errorMessage && (
          <Text mt={2} fontSize="sm" color="red.500" textAlign="center">
            {errorMessage}
          </Text>
        )}
      </ModalContent>
    </Modal>
  );
}
