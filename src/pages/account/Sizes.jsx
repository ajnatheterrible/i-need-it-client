import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  SimpleGrid,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import Container from "../../components/shared/Container";
import AccountSidebar from "../../components/sidebars/AccountSidebar";
import useFetchSizes from "../../hooks/useFetchSizes";
import useAuthStore from "../../store/authStore";

const menswearSizes = {
  Tops: ["XS", "S", "M", "L", "XL"],
  Bottoms: ["XS", "S", "M", "L", "XL"],
  Outerwear: ["XS", "S", "M", "L", "XL"],
  Tailoring: ["XS", "S", "M", "L", "XL"],
  Footwear: ["40", "41", "42", "43", "44", "45"],
};

const womenswearSizes = {
  Tops: ["XS", "S", "M", "L", "XL"],
  Bottoms: ["XS", "S", "M", "L", "XL"],
  Outerwear: ["XS", "S", "M", "L", "XL"],
  Dresses: ["XS", "S", "M", "L", "XL"],
  Footwear: ["37", "38", "39", "40", "41"],
};

export default function Sizes() {
  const [selectedSizes, setSelectedSizes] = useState({
    menswear: {},
    womenswear: {},
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { loading, error } = useFetchSizes();

  const fetchedSizes = useAuthStore((s) => s.fetchedData?.sizes);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  useEffect(() => {
    if (fetchedSizes) {
      setSelectedSizes({
        menswear: { ...fetchedSizes.menswear },
        womenswear: { ...fetchedSizes.womenswear },
      });
    }
  }, [fetchedSizes]);

  const handleCheckboxChange = (section, category, size) => {
    setSelectedSizes((prev) => {
      const currentSizes = prev[section]?.[category] || [];
      const isSelected = currentSizes.includes(size);

      const updatedSizes = isSelected
        ? currentSizes.filter((s) => s !== size)
        : [...currentSizes, size];

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [category]: updatedSizes,
        },
      };
    });
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
        body: JSON.stringify(selectedSizes),
      });

      const data = await res.json();

      if (res.ok) {
        setFetchedData({ sizes: data.sizes });
      } else {
        console.error("Failed to save sizes:", data.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setHasSubmitted(false);
    }
  };

  const renderSizeGrid = (sectionKey, sizeMap) =>
    Object.entries(sizeMap).map(([category, sizes]) => (
      <Box key={category}>
        <Text fontWeight="semibold" mb={2}>
          {category}
        </Text>
        <SimpleGrid columns={[4, 6, 8]} spacing={3}>
          {sizes.map((size) => (
            <Checkbox
              colorScheme="gray"
              key={size}
              isChecked={
                selectedSizes?.[sectionKey]?.[category]?.includes(size) || false
              }
              onChange={() => handleCheckboxChange(sectionKey, category, size)}
            >
              {size}
            </Checkbox>
          ))}
        </SimpleGrid>
      </Box>
    ));

  return (
    <Container>
      <Grid templateColumns="repeat(12, 1fr)" gap={8} py={10}>
        <GridItem colSpan={2}>
          <AccountSidebar />
        </GridItem>

        <GridItem colSpan={8} display="flex" flexDirection="column">
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
          ) : (
            <motion.div
              style={{ width: "100%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <VStack align="start" spacing={8}>
                <Box>
                  <Heading size="md" mb={1}>
                    My sizes
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Set up to filter out listings that are not in your size
                  </Text>
                </Box>

                <Tabs variant="unstyled">
                  <TabList>
                    <Tab
                      _selected={{
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                      }}
                      pb={2}
                      mr={4}
                    >
                      Menswear
                    </Tab>
                    <Tab
                      _selected={{
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                      }}
                      pb={2}
                    >
                      Womenswear
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0}>
                      <VStack align="start" spacing={8}>
                        {renderSizeGrid("menswear", menswearSizes)}
                      </VStack>
                    </TabPanel>

                    <TabPanel px={0}>
                      <VStack align="start" spacing={8}>
                        {renderSizeGrid("womenswear", womenswearSizes)}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Button
                  mt={4}
                  w="full"
                  colorScheme="blackAlpha"
                  bg="black"
                  color="white"
                  onClick={handleSave}
                  isLoading={hasSubmitted}
                >
                  Save My Sizes
                </Button>
              </VStack>
            </motion.div>
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}
