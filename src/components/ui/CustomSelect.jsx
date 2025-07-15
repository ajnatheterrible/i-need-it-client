import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function CustomSelect({
  id,
  label,
  placeholder,
  options = [],
  value,
  onChange,
  error = false,
  colorIndicator,
  isDisabled,
}) {
  return (
    <FormControl isInvalid={error} id={id}>
      {label && (
        <FormLabel htmlFor={id} fontSize="20px" fontWeight="bold" mb={4}>
          {label}
        </FormLabel>
      )}

      <Box position="relative">
        <Menu matchWidth>
          <MenuButton
            as={Button}
            isDisabled={isDisabled}
            w="100%"
            textAlign="left"
            variant="outline"
            bg="white"
            fontWeight="normal"
            _hover={{ bg: "none", cursor: "default" }}
            _expanded={{ bg: "none" }}
            _focus={{ boxShadow: "none" }}
            {...(error
              ? {
                  border: "2px solid",
                  borderColor: "red.500",
                }
              : {
                  border: "1px solid",
                  borderColor: "gray.200",
                })}
          >
            {value ? (
              <HStack spacing={3}>
                {colorIndicator?.(value)}
                <Text>{value.name || value}</Text>
              </HStack>
            ) : (
              <Text color="gray.500">{placeholder}</Text>
            )}
          </MenuButton>

          <Icon
            as={ChevronDownIcon}
            position="absolute"
            right="0.6rem"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            boxSize={5}
            opacity={isDisabled ? 0.4 : 1}
          />

          <MenuList maxH="200px" overflowY="auto" zIndex={20}>
            {options.map((option) => (
              <MenuItem
                key={option.name || option}
                onClick={() => onChange(option)}
                _hover={{ bg: "gray.100" }}
              >
                <HStack spacing={3}>
                  {colorIndicator?.(option)}
                  <Text>{option.name || option}</Text>
                </HStack>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </FormControl>
  );
}
