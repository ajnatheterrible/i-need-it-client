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
  Divider,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const shippingRegions = [
  { label: "Canada", value: "Canada" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Europe", value: "Europe" },
  { label: "Asia", value: "Asia" },
  { label: "Australia / NZ", value: "Australia / NZ" },
  { label: "Other", value: "Other" },
];

export default function ShippingSection({
  selectedAddress,
  selectedRegions,
  shippingCosts,
  toggleRegion,
  handleShippingCostChange,
  onEditAddress,
  onAddAddress,
  hasSubmitted,
}) {
  return (
    <Box mb={16}>
      <Box mb={8}>
        <Heading fontSize="20px" fontWeight="bold" mb={2}>
          Shipping from
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={8}>
          Shipping options vary depending on the address you're sending your
          item from
        </Text>

        {selectedAddress ? (
          <HStack
            justifyContent="space-between"
            align="center"
            mb={8}
            _hover={{ cursor: "pointer" }}
            onClick={onEditAddress}
          >
            <Box>
              <Text fontSize="sm" fontWeight="semibold">
                {selectedAddress?.fullName}
              </Text>
              <Text fontSize="sm" fontWeight="semibold">
                {selectedAddress?.line1}
              </Text>
              {selectedAddress?.line2 && (
                <Text fontSize="sm">{selectedAddress.line2}</Text>
              )}
              <Text fontSize="xs" color="gray.500">
                {selectedAddress?.city}, {selectedAddress?.state}{" "}
                {selectedAddress?.zip}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {selectedAddress?.country}
              </Text>
            </Box>
            <Icon as={ChevronRightIcon} boxSize={5} />
          </HStack>
        ) : (
          <HStack
            justifyContent="space-between"
            align="center"
            mb={8}
            _hover={{ cursor: "pointer" }}
            onClick={onAddAddress}
          >
            <Box mx="auto">
              <Text
                fontSize="sm"
                color={hasSubmitted ? "red.500" : "gray.300"}
                fontWeight={hasSubmitted && "semibold"}
              >
                You haven't added any addresses yet. Add a default return
                address.
              </Text>
            </Box>
            <Icon
              as={ChevronRightIcon}
              color={hasSubmitted && "red.500"}
              boxSize={5}
            />
          </HStack>
        )}

        <Divider />
      </Box>

      <Box>
        <Heading fontSize="20px" fontWeight="bold" mb={2}>
          Shipping regions
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
                    isChecked={selectedRegions?.includes(region.value)}
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
