import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Box,
  Collapse,
  IconButton,
  Checkbox,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";

const sizeOptions = {
  menswear: {
    Tops: ["XS", "S", "M", "L", "XL"],
    Bottoms: ["XS", "S", "M", "L", "XL"],
    Outerwear: ["XS", "S", "M", "L", "XL"],
    Tailoring: ["XS", "S", "M", "L", "XL"],
    Footwear: ["40", "41", "42", "43", "44", "45"],
  },
  womenswear: {
    Tops: ["XS", "S", "M", "L", "XL"],
    Bottoms: ["XS", "S", "M", "L", "XL"],
    Outerwear: ["XS", "S", "M", "L", "XL"],
    Dresses: ["XS", "S", "M", "L", "XL"],
    Footwear: ["37", "38", "39", "40", "41"],
  },
};

export default function EditSizesModal({ isOpen, onClose }) {
  const fetchedData = useAuthStore((s) => s.fetchedData);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);
  const [activeTab, setActiveTab] = useState("menswear");
  const [sizes, setSizes] = useState({ menswear: {}, womenswear: {} });
  const [expanded, setExpanded] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (
      isOpen &&
      fetchedData?.sizes &&
      Object.keys(fetchedData.sizes).length > 0
    ) {
      setSizes(fetchedData.sizes);
    }
  }, [isOpen, fetchedData]);

  const toggleSize = (department, category, size) => {
    setSizes((prev) => {
      const current = prev[department][category] || [];
      const newSelection = current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size];

      return {
        ...prev,
        [department]: {
          ...prev[department],
          [category]: newSelection,
        },
      };
    });
  };

  const toggleCollapse = (category) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = async () => {
    try {
      setHasSubmitted(true);

      const res = await fetch(`/api/users/sizes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sizes),
      });

      const data = await res.json();

      if (res.ok) {
        setFetchedData({ sizes: data.sizes });
        onClose();
      } else {
        console.error("Failed to save sizes:", data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setHasSubmitted(false);
    }
  };

  const renderSection = (department) =>
    Object.entries(sizeOptions[department]).map(([category, options]) => (
      <Box key={category} w="100%">
        <HStack
          justify="space-between"
          align="center"
          py={2}
          px={1}
          onClick={() => toggleCollapse(category)}
          cursor="pointer"
        >
          <Text fontWeight="semibold">{category}</Text>
          <IconButton
            size="xs"
            icon={expanded[category] ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="ghost"
            aria-label="Toggle"
          />
        </HStack>
        <Collapse in={expanded[category]}>
          <HStack wrap="wrap" spacing={3} px={2} pb={3}>
            {options.map((size) => (
              <Checkbox
                key={size}
                isChecked={(sizes[department]?.[category] || []).includes(size)}
                onChange={() => toggleSize(department, category, size)}
              >
                {size}
              </Checkbox>
            ))}
          </HStack>
        </Collapse>
      </Box>
    ));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent position="relative">
        <ModalHeader textAlign="center" position="relative">
          My Sizes
          <Button
            variant="ghost"
            size="xs"
            color="gray.500"
            position="absolute"
            right="48px"
            top="16px"
            onClick={() => setSizes({ menswear: {}, womenswear: {} })}
          >
            Clear All
          </Button>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <Text fontSize="sm" textAlign="center" mb={4} color="gray.600">
            Set up to filter out listings that are not in your size
          </Text>

          <Tabs
            isFitted
            variant="unstyled"
            onChange={(i) => setActiveTab(i === 0 ? "menswear" : "womenswear")}
          >
            <TabList mb={4}>
              <Tab _selected={{ borderBottom: "2px solid black" }}>
                MENSWEAR
              </Tab>
              <Tab _selected={{ borderBottom: "2px solid black" }}>
                WOMENSWEAR
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{renderSection("menswear")}</TabPanel>
              <TabPanel>{renderSection("womenswear")}</TabPanel>
            </TabPanels>
          </Tabs>

          <Button
            colorScheme="blackAlpha"
            width="100%"
            mt={4}
            onClick={handleSave}
            isLoading={hasSubmitted}
          >
            SAVE MY SIZES
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
