import {
  Box,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Icon,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";
import { PuffLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import Container from "../components/shared/Container";
import TagInput from "../components/ui/tagInput";
import CustomSelect from "../components/ui/CustomSelect";
import GroupedSelect from "../components/ui/GroupedSelect";
import ShippingSection from "../components/ui/ShippingSection";
import DeleteDraftDialog from "../components/ui/DeleteDraftDialog";

import designers from "../data/designers";
import categoryMap from "../data/categoryMap";
import {
  clothingSizes,
  footwearSizes,
  nonSizedCategories,
  colors,
  conditions,
} from "../data/listingFields";
import countries from "../data/countries";

import { formatCurrency, validatePrice } from "../utils/priceUtils";
import { handleImageUpload } from "../utils/imageUtils";
import { uploadListing, patchListing } from "../utils/uploadListingUtils";

export default function Sell() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const { draftId, editId } = useParams();
  const listingId = draftId || editId;

  const inputRef = useRef(null);
  const didScrollOnValidation = useRef(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState("");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [shippingCosts, setShippingCosts] = useState({});
  const [tags, setTags] = useState([]);

  const [showDesignerDropdown, setShowDesignerDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [designerInput, setDesignerInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [priceError, setPriceError] = useState("");
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);

  const [uploadedImageUrls, setUploadedImageUrls] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [uploadingIndex, setUploadingIndex] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [missingItemName, setMissingItemName] = useState(false);
  const [isDraftEdit, setIsDraftEdit] = useState(false);

  const availableSubcategories =
    selectedDepartment && selectedCategory
      ? categoryMap[selectedDepartment][selectedCategory] || []
      : [];
  const isOneSizeCategory =
    selectedCategory && nonSizedCategories.includes(selectedCategory);
  const isSizeCategory = !!selectedCategory;
  const isFootwearCategory = selectedCategory === "Footwear";
  const sizeOptions = isFootwearCategory ? footwearSizes : clothingSizes;

  const filteredDesigners = designerInput
    ? designers
        .filter((d) => d.toLowerCase().includes(designerInput.toLowerCase()))
        .slice(0, 10)
    : designers;

  const filteredCountries = countryInput
    ? countries
        .filter((c) =>
          c.toLowerCase().includes(countryInput.trim().toLowerCase())
        )
        .slice(0, 10)
    : countries;

  const handleCategorySelect = (value) => {
    const [dept, cat] = value.split("-");
    setSelectedDepartment(dept);
    setSelectedCategory(cat);
    setSelectedSubcategory("");
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
    setPriceInput(formatCurrency(raw));

    const { isValid, error } = validatePrice(raw);
    setIsPriceInvalid(!isValid);
    setPriceError(error);
  };

  const toggleRegion = (region) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions((prev) => prev.filter((r) => r !== region));
      setShippingCosts((prev) => {
        const updated = { ...prev };
        delete updated[region];
        return updated;
      });
    } else {
      setSelectedRegions((prev) => [...prev, region]);
    }
  };

  const handleShippingCostChange = (region, value) => {
    setShippingCosts((prev) => ({
      ...prev,
      [region]: value,
    }));
  };

  const address = {
    name: "Joey Pereira",
    street: "2445 NW 158th St",
    cityStateZip: "Opa Locka, FL 33054",
    country: "United States",
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    const requiredFields = [
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      selectedColor,
      selectedCondition,
      priceInput,
      countryOfOrigin,
    ];

    const hasMissingFields = requiredFields.some(
      (field) => field === undefined || field === null || field === ""
    );

    const hasNoImages = uploadedImageUrls.filter(Boolean).length === 0;

    if (hasMissingFields || hasNoImages) {
      if (!didScrollOnValidation.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        didScrollOnValidation.current = true;
      }
      return;
    }

    const formData = {
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      description,
      selectedColor,
      selectedCondition,
      priceInput,
      acceptOffers,
      countryOfOrigin,
      tags,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean),
    };

    try {
      setIsSubmitting(true);

      let listing = listingId
        ? await patchListing(formData, token, listingId)
        : await uploadListing(formData, token);

      if (listing?._id) {
        navigate(`/listing/${listing._id}`);
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = {
      selectedDepartment,
      selectedCategory,
      selectedSubcategory,
      selectedSize,
      selectedDesigner,
      itemName,
      description,
      selectedColor,
      selectedCondition,
      priceInput,
      acceptOffers,
      countryOfOrigin,
      tags,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean),
      isDraft: true,
    };

    if (!itemName) {
      setMissingItemName(true);
      if (!didScrollOnValidation.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        didScrollOnValidation.current = true;
      }
      return;
    }

    try {
      setIsSubmitting(true);

      if (isDraftEdit) {
        const listing = await patchListing(formData, token, listingId);
        if (listing?._id) {
          navigate("/drafts");
          return;
        }
      } else {
        const listing = await uploadListing(formData, token);
        if (listing?._id) {
          navigate("/drafts");
          return;
        }
      }
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const populateForm = (data) => {
    setSelectedDepartment(data.department ?? undefined);
    setSelectedCategory(data.category ?? undefined);
    setSelectedSubcategory(data.subCategory ?? undefined);
    setDesignerInput(data.designer ?? undefined);
    setSelectedDesigner(data.designer ?? undefined);
    setItemName(data.title ?? undefined);
    setDescription(data.description ?? "");
    setSelectedSize(data.size ?? undefined);
    setCountryOfOrigin(data.countryOfOrigin ?? undefined);
    setAcceptOffers(data.canOffer ?? true);
    setSelectedColor(colors.find((c) => c.name === data.color) ?? undefined);
    setSelectedCondition(data.condition ?? undefined);
    setTags(data.tags ?? []);
    setPriceInput(data.price !== undefined ? `$${data.price}` : "");
    setUploadedImageUrls(
      data.images?.length
        ? [...data.images, null, null, null, null, null].slice(0, 5)
        : [null, null, null, null, null]
    );
  };

  useEffect(() => {
    if (!draftId) return;

    const fetchDraft = async () => {
      try {
        const res = await fetch(`/api/listings/${draftId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          populateForm(data);
        } else {
          console.error("Failed to load draft:", data?.error || data);
        }
      } catch (err) {
        console.error("Error fetching draft:", err);
      }

      setIsDraftEdit(true);
    };

    fetchDraft();
  }, [draftId]);

  useEffect(() => {
    if (!editId) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${editId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          populateForm(data);
        } else {
          console.error("Failed to load listing:", data?.error || data);
        }
      } catch (err) {
        console.error("Error fetching draft:", err);
      }

      setIsListingEdit(true);
    };

    fetchListing();
  }, [editId]);

  const handleDeleteDraft = async () => {
    if (!draftId) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/market/delete-draft`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ draftId }),
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.message);
      }

      navigate("/drafts");
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error deleting draft:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Container>
      <Box maxW="960px" mx="auto" py={10}>
        <HStack justify="space-between" mb={16}>
          <Heading fontSize="32px" fontWeight="bold">
            Add a new listing
          </Heading>
          <Text fontSize="sm" color="#DCEF31" fontWeight="semibold">
            HOW TO SELL GUIDE
          </Text>
        </HStack>

        <Box mb={16}>
          <Heading fontSize="20px" fontWeight="bold" mb={4}>
            Details
          </Heading>
          <SimpleGrid columns={8} spacing={4}>
            <Grid gridColumn="span 4">
              <GroupedSelect
                placeholder="Department / Category"
                value={
                  selectedDepartment && selectedCategory
                    ? `${selectedDepartment}-${selectedCategory}`
                    : ""
                }
                onChange={handleCategorySelect}
                isInvalid={hasSubmitted && !selectedDepartment}
                options={Object.entries(categoryMap).flatMap(
                  ([dept, categories]) => [
                    { isGroupLabel: true, label: dept },
                    ...Object.keys(categories).map((cat) => ({
                      label: cat,
                      value: `${dept}-${cat}`,
                    })),
                  ]
                )}
              />
            </Grid>

            <Grid gridColumn="span 4">
              <CustomSelect
                id="sub-category"
                placeholder="Sub-category (select category first)"
                options={availableSubcategories}
                value={selectedSubcategory}
                onChange={setSelectedSubcategory}
                error={hasSubmitted && !selectedSubcategory}
                isDisabled={!selectedCategory}
              />
            </Grid>

            <Grid gridColumn="span 4">
              <FormControl
                id="designer"
                isInvalid={hasSubmitted && !selectedDesigner}
              >
                <Box position="relative">
                  <Input
                    placeholder="Designer (select category first)"
                    value={designerInput}
                    onFocus={() => {
                      if (designers.length > 0) setShowDesignerDropdown(true);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDesignerInput(value);
                      setSelectedDesigner(null);
                      setShowDesignerDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDesignerDropdown(false), 100);
                      const isValid = designers.some(
                        (d) =>
                          d.toLowerCase() === designerInput.trim().toLowerCase()
                      );
                      if (!isValid) setDesignerInput("");
                    }}
                    isDisabled={!selectedCategory}
                    pr="2.5rem"
                    bg="white"
                    borderRadius="md"
                  />

                  <AnimatePresence>
                    {(designerInput || showDesignerDropdown) &&
                      !selectedDesigner &&
                      filteredDesigners.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 10,
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
                            {filteredDesigners.map((name) => (
                              <Box
                                key={name}
                                px={4}
                                py={2}
                                _hover={{ bg: "gray.100", cursor: "pointer" }}
                                onMouseDown={() => {
                                  setDesignerInput(name);
                                  setSelectedDesigner(name);
                                }}
                              >
                                {name}
                              </Box>
                            ))}
                          </Box>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </Box>
              </FormControl>
            </Grid>

            <Grid gridColumn="span 4">
              <CustomSelect
                id="size"
                placeholder="Size (select category first)"
                options={isOneSizeCategory ? ["One Size"] : sizeOptions}
                value={selectedSize}
                onChange={setSelectedSize}
                error={hasSubmitted && !selectedSize}
                isDisabled={!isSizeCategory}
              />
            </Grid>
          </SimpleGrid>
        </Box>

        <Box mb={16}>
          <FormControl
            id="item-name"
            isInvalid={(hasSubmitted && !itemName) || missingItemName}
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Item name
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Input
                  placeholder="Item name"
                  value={itemName}
                  onChange={(e) => {
                    setMissingItemName(false);

                    const raw = e.target.value;
                    const cleaned = raw.replace(/[^a-zA-Z0-9' ]/g, "");

                    setItemName(cleaned);
                  }}
                />
              </Grid>
            </SimpleGrid>
          </FormControl>
        </Box>

        <SimpleGrid columns={8} spacing={4} mb={16}>
          <Grid gridColumn="span 4">
            <CustomSelect
              id="color"
              label="Color"
              placeholder="Select a color"
              options={colors}
              value={selectedColor}
              onChange={setSelectedColor}
              error={hasSubmitted && !selectedColor}
              colorIndicator={(option) => (
                <Box w="14px" h="14px" borderRadius="full" bg={option.hex} />
              )}
            />
          </Grid>
        </SimpleGrid>

        <SimpleGrid columns={8} spacing={4} mb={16}>
          <Grid gridColumn="span 4">
            <CustomSelect
              id="condition"
              label="Condition"
              placeholder="Select a condition"
              options={conditions}
              value={selectedCondition}
              onChange={setSelectedCondition}
              error={hasSubmitted && !selectedCondition}
            />
          </Grid>
        </SimpleGrid>

        <Box mb={16}>
          <FormControl id="description">
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Description
            </FormLabel>
            <Textarea
              placeholder="Add details about condition..."
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
              }}
              value={description}
              py={4}
            />
          </FormControl>
        </Box>

        <Box mb={16}>
          <TagInput tags={tags} setTags={setTags} />
        </Box>

        <SimpleGrid columns={8} spacing={4} mb={16}>
          <Grid gridColumn="span 4">
            <FormControl
              id="country-of-origin"
              isInvalid={hasSubmitted && !countryOfOrigin}
            >
              <FormLabel fontSize="20px" fontWeight="bold">
                Where was your item made?
              </FormLabel>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Provide the{" "}
                <Text as="span" fontWeight="bold">
                  country of origin for this product
                </Text>{" "}
                for customs
              </Text>

              <Input
                ref={inputRef}
                placeholder="Country name"
                value={countryInput}
                onChange={(e) => {
                  setCountryInput(e.target.value);
                  setShowCountryDropdown(true);
                }}
                onFocus={() => setShowCountryDropdown(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setShowCountryDropdown(false);

                    if (!filteredCountries.includes(countryInput)) {
                      setCountryInput("");
                      setCountryOfOrigin("");
                    }
                  }, 100)
                }
                borderWidth="1px"
                borderColor={
                  hasSubmitted && !countryOfOrigin ? "red.500" : "gray.200"
                }
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
                      {filteredCountries.map((c) => (
                        <Box
                          key={c}
                          px={4}
                          py={2}
                          _hover={{ bg: "gray.100", cursor: "pointer" }}
                          onMouseDown={() => {
                            setCountryInput(c);
                            setCountryOfOrigin(c);
                            setShowCountryDropdown(false);
                          }}
                        >
                          {c}
                        </Box>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </FormControl>
          </Grid>
        </SimpleGrid>

        <Box mb={8}>
          <FormControl
            id="price"
            isInvalid={(hasSubmitted && !priceInput) || isPriceInvalid}
          >
            <FormLabel fontSize="20px" fontWeight="bold" mb={4}>
              Price
            </FormLabel>
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 4">
                <Input
                  placeholder="$ Price USD"
                  value={priceInput}
                  onChange={handlePriceChange}
                  onBlur={() => {
                    if (!priceInput) {
                      return;
                    }

                    const clean = parseFloat(
                      priceInput.replace(/[^0-9.]/g, "")
                    );
                    if (isNaN(clean) || clean < 1 || clean > 200000) {
                      setPriceInput("");
                      setIsPriceInvalid(true);
                      setPriceError("Price must be between $1 and $200,000");
                    } else {
                      setIsPriceInvalid(false);
                      setPriceError("");
                    }
                  }}
                  textAlign="left"
                  fontWeight="semibold"
                  color={isPriceInvalid ? "red.500" : "gray.800"}
                  _placeholder={{
                    color: isPriceInvalid ? "red.300" : "gray.500",
                    fontWeight: isPriceInvalid ? "semibold" : "normal",
                  }}
                />
              </Grid>
            </SimpleGrid>
            {priceError && (
              <FormErrorMessage fontWeight="bold" fontSize="xs">
                {priceError}
              </FormErrorMessage>
            )}
          </FormControl>
        </Box>

        <Box mb={16} w="50%">
          <FormControl id="accept-offers" display="flex" alignItems="center">
            <FormLabel
              htmlFor="accept-offers"
              mb="0"
              fontSize="md"
              fontWeight="bold"
            >
              Accept offers
            </FormLabel>
            <Box ml="auto">
              <input
                id="accept-offers"
                type="checkbox"
                style={{ display: "none" }}
                checked={acceptOffers || false}
                onChange={(e) =>
                  setAcceptOffers(e.target.checked ? true : false)
                }
              />
              <Box
                as="label"
                htmlFor="accept-offers"
                cursor="pointer"
                display="inline-block"
                w="42px"
                h="24px"
                bg={acceptOffers ? "gray.800" : "gray.300"}
                borderRadius="full"
                position="relative"
                transition="background-color 0.2s"
              >
                <Box
                  w="18px"
                  h="18px"
                  bg="white"
                  borderRadius="full"
                  position="absolute"
                  top="3px"
                  left={acceptOffers ? "20px" : "4px"}
                  transition="left 0.2s"
                  boxShadow="md"
                />
              </Box>
            </Box>
          </FormControl>
        </Box>

        <ShippingSection
          address={address}
          selectedRegions={selectedRegions}
          shippingCosts={shippingCosts}
          toggleRegion={toggleRegion}
          handleShippingCostChange={handleShippingCostChange}
        />

        <Box mb={16}>
          <Heading fontSize="20px" fontWeight="bold" mb={4}>
            Photos
          </Heading>

          {hasSubmitted && !uploadedImageUrls.some(Boolean) && (
            <Alert
              status="error"
              variant="left-accent"
              borderRadius="md"
              bg="red.50"
              mb={4}
            >
              <AlertIcon />
              <Text fontSize="sm">Please add at least one</Text>
            </Alert>
          )}

          <Grid templateColumns="repeat(8, 1fr)" gap={4}>
            {[0, 1, 2, 3, 4].map((index) => {
              const url = uploadedImageUrls[index];
              const isUploading = uploadingIndex === index;

              return (
                <GridItem
                  key={index}
                  colSpan={index === 0 ? 4 : 2}
                  rowSpan={index === 0 ? 2 : 1}
                >
                  <label
                    htmlFor={`photo-${index}`}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Box
                      w="100%"
                      h="100%"
                      maxHeight="500px"
                      bg="gray.100"
                      borderRadius="md"
                      border="1px dashed gray"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      overflow="hidden"
                      position="relative"
                      aspectRatio={index === 0 ? undefined : "1"}
                    >
                      {isUploading ? (
                        <PuffLoader size={40} color="#666" />
                      ) : url ? (
                        <>
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center center",
                            }}
                          />
                          <Button
                            size="xs"
                            position="absolute"
                            top="8px"
                            right="8px"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setUploadedImageUrls((prev) => {
                                const next = [...prev];
                                next[index] = null;
                                return next;
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Icon as={FaCamera} boxSize={5} color="gray.500" />
                      )}
                    </Box>
                    <input
                      id={`photo-${index}`}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      hidden
                      onChange={(e) =>
                        handleImageUpload(
                          e.target.files[0],
                          index,
                          setUploadedImageUrls,
                          setUploadingIndex
                        )
                      }
                    />
                  </label>
                </GridItem>
              );
            })}
          </Grid>
        </Box>

        <Box
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          zIndex="1000"
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          py={4}
        >
          <Box maxW="960px" mx="auto">
            <SimpleGrid columns={8} spacing={4}>
              <Grid gridColumn="span 8">
                <HStack
                  justify={draftId ? "space-between" : "flex-end"}
                  spacing={4}
                >
                  {draftId && (
                    <DeleteDraftDialog
                      onConfirm={handleDeleteDraft}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {!editId && (
                    <HStack spacing={4}>
                      <Button
                        variant="outline"
                        colorScheme="gray"
                        onClick={handleSaveDraft}
                        isDisabled={isSubmitting}
                      >
                        {draftId ? "Save Changes" : "Save as Draft"}
                      </Button>

                      <Button
                        bg="#DCEF31"
                        color="black"
                        _hover={{ bg: "#C5E426" }}
                        onClick={handleSubmit}
                        isDisabled={isSubmitting}
                      >
                        Publish
                      </Button>
                    </HStack>
                  )}
                  {editId && (
                    <Button
                      bg="#DCEF31"
                      color="black"
                      _hover={{ bg: "#C5E426" }}
                      onClick={handleSubmit}
                      isDisabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  )}
                </HStack>
              </Grid>
            </SimpleGrid>
          </Box>
        </Box>
      </Box>

      {isSubmitting && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.8)"
          zIndex={2000}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PuffLoader size={60} color="#333" />
        </Box>
      )}
    </Container>
  );
}
