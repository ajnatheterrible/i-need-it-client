import {
  Box,
  Heading,
  Text,
  Switch,
  HStack,
  SimpleGrid,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const shippingRegions = [
  { label: "Canada", value: "canada" },
  { label: "United Kingdom", value: "uk" },
  { label: "Europe", value: "europe" },
  { label: "Asia", value: "asia" },
  { label: "Australia / NZ", value: "anz" },
  { label: "Other", value: "other" },
];

export default function ShippingSection({
  address,
  selectedRegions,
  shippingCosts,
  toggleRegion,
  handleShippingCostChange,
}) {
  return (
    <Box mb={16}>
      <Box mb={8}>
        <Heading fontSize="20px" fontWeight="bold" mb={2}>
          Shipping From
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={8}>
          Shipping options vary depending on the address you're sending your
          item from
        </Text>

        <HStack justifyContent="space-between" align="center" mb={8}>
          <Box>
            <Text fontSize="sm">{address.name}</Text>
            <Text fontSize="sm">{address.street}</Text>
            <Text fontSize="xs" color="gray.500">
              {address.cityStateZip}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {address.country}
            </Text>
          </Box>
          <Icon as={ChevronRightIcon} boxSize={5} />
        </HStack>

        <Divider />
      </Box>

      <Box>
        <Heading fontSize="20px" fontWeight="bold" mb={2}>
          Shipping Regions
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6}>
          Select regions you are willing to ship to
        </Text>

        <SimpleGrid columns={8} spacing={4}>
          {shippingRegions.map((region) => (
            <GridItem key={region.value} colSpan={8}>
              <HStack justify="space-between" align="center" py={4} mb={4}>
                <Box>
                  <Text fontWeight="bold">{region.label}</Text>

                  {selectedRegions?.includes(region.value) && (
                    <Text fontSize="xs" color="gray.500">
                      Set a shipping cost and purchase your own label at
                      preferred carrier.
                    </Text>
                  )}
                </Box>

                <HStack spacing={4}>
                  {selectedRegions?.includes(region.value) && (
                    <Input
                      mr={8}
                      maxW="200px"
                      placeholder="$"
                      value={`$${shippingCosts[region.value] || ""}`}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                        handleShippingCostChange(region.value, rawValue);
                      }}
                    />
                  )}

                  <Switch
                    isChecked={selectedRegions.includes(region.value)}
                    onChange={() => toggleRegion(region.value)}
                    size="md"
                    colorScheme="blackAlpha"
                  />
                </HStack>
              </HStack>
              <Divider />
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
