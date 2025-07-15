import {
  Box,
  Text,
  HStack,
  VStack,
  Divider,
  Switch,
  Button,
  Collapse,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import EditSizesModal from "../modals/EditSizesModal";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useAuthModal } from "../../context/AuthModalContext";

export default function FilterSidebar({
  filters,
  setFilters,
  isUsingMySizes,
  setIsUsingMySizes,
  mode,
}) {
  const [showDepartment, setShowDepartment] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showSize, setShowSize] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["New/Never Worn", "Used", "Gently Used", "Very Worn"];
  const mensCategories = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Footwear",
    "Tailoring",
    "Accessories",
  ];
  const womensCategories = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Dresses",
    "Footwear",
    "Accessories",
  ];

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const onOpenAuthModal = useAuthModal();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query");

  const handleCheckbox = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...(prev[field] || []), value],
    }));
  };

  const withTooltip = (element, key) => {
    return query || mode !== "search" ? (
      <Box key={key}>{element}</Box>
    ) : (
      <Tooltip
        key={key}
        label="Enter a search term to use filters"
        hasArrow
        bg="gray.100"
        color="black"
        fontSize="xs"
        px={3}
        py={2}
        borderRadius="md"
        boxShadow="md"
      >
        <Box display="inline-block" w="100%">
          {element}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      position="sticky"
      top="140px"
      w="25%"
      bg="white"
      zIndex={1}
      alignSelf="flex-start"
      maxHeight="calc(100vh - 140px)"
      overflowY="auto"
      pr={2}
      sx={{
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        scrollbarWidth: "thin",
        scrollbarColor: "transparent transparent",
      }}
    >
      <VStack align="start" spacing={6}>
        {withTooltip(
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            w="100%"
          >
            <HStack justify="space-between" w="100%">
              <Text fontWeight="bold">My Sizes</Text>
              <Switch
                isChecked={isUsingMySizes}
                onChange={() =>
                  isLoggedIn
                    ? setIsUsingMySizes((prev) => !prev)
                    : onOpenAuthModal("register")
                }
                isDisabled={!query && mode === "search"}
              />
            </HStack>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Turn on to filter out listings that are not in your size.
            </Text>

            <Button
              onClick={() =>
                isLoggedIn ? setIsEditOpen(true) : onOpenAuthModal("register")
              }
              variant="link"
              size="xs"
              mt={1}
            >
              Edit
            </Button>
          </Box>
        )}

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowDepartment(!showDepartment)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Department</Text>
            {showDepartment ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showDepartment} animateOpacity>
            <VStack align="start" spacing={2} mt={2}>
              {["Menswear", "Womenswear"].map((dept) =>
                withTooltip(
                  <Checkbox
                    key={dept}
                    isChecked={(filters.department || []).includes(dept)}
                    onChange={() => handleCheckbox("department", dept)}
                    isDisabled={!query && mode === "search"}
                  >
                    {dept}
                  </Checkbox>,
                  dept
                )
              )}
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowCategory(!showCategory)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Category</Text>
            {showCategory ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showCategory} animateOpacity>
            <VStack align="start" spacing={2} mt={2}>
              {[...new Set([...mensCategories, ...womensCategories])].map(
                (cat) =>
                  withTooltip(
                    <Checkbox
                      isChecked={(filters.category || []).includes(cat)}
                      onChange={() => handleCheckbox("category", cat)}
                      isDisabled={!query && mode === "search"}
                    >
                      {cat}
                    </Checkbox>,
                    cat
                  )
              )}
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowSize(!showSize)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Size</Text>
            {showSize ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showSize} animateOpacity>
            <VStack align="start" spacing={2} mt={2}>
              {sizes.map((size) =>
                withTooltip(
                  <Checkbox
                    isChecked={(filters.size || []).includes(size)}
                    onChange={() => handleCheckbox("size", size)}
                    isDisabled={!query && mode === "search"}
                  >
                    {size}
                  </Checkbox>,
                  size
                )
              )}
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowCondition(!showCondition)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Condition</Text>
            {showCondition ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showCondition} animateOpacity>
            <VStack align="start" spacing={2} mt={2}>
              {conditions.map((label) =>
                withTooltip(
                  <Checkbox
                    isChecked={(filters.condition || []).includes(label)}
                    onChange={() => handleCheckbox("condition", label)}
                    isDisabled={!query && mode === "search"}
                  >
                    {label}
                  </Checkbox>,
                  label
                )
              )}
            </VStack>
          </Collapse>
        </Box>

        <Divider />

        <Box w="100%">
          <HStack
            justify="space-between"
            onClick={() => setShowPrice(!showPrice)}
            cursor="pointer"
          >
            <Text fontWeight="bold">Price</Text>
            {showPrice ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </HStack>
          <Collapse in={showPrice} animateOpacity>
            <VStack spacing={3} align="stretch" mt={3}>
              {["Min", "Max"].map((label, idx) =>
                withTooltip(
                  <HStack
                    key={label}
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                    px={3}
                    py={1}
                    spacing={2}
                  >
                    <Text color="gray.500" fontSize="sm">
                      $
                    </Text>
                    <input
                      type="number"
                      placeholder={label}
                      value={
                        idx === 0
                          ? filters.priceMin || ""
                          : filters.priceMax || ""
                      }
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [idx === 0 ? "priceMin" : "priceMax"]: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        }))
                      }
                      isDisabled={!query && mode === "search"}
                      style={{
                        outline: "none",
                        border: "none",
                        flex: 1,
                        fontSize: "0.875rem",
                        color: "#4A5568",
                        background: "transparent",
                      }}
                    />
                  </HStack>,
                  label
                )
              )}
            </VStack>
            <Divider mt={3} />
          </Collapse>
        </Box>
      </VStack>

      <EditSizesModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </Box>
  );
}
