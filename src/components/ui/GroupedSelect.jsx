import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

const MotionMenuList = motion(MenuList);

export default function GroupedSelect({
  placeholder,
  value,
  onChange,
  options,
  isInvalid = false,
}) {
  return (
    <Menu matchWidth autoSelect={false}>
      {({ isOpen }) => (
        <Box position="relative">
          <MenuButton
            as={Button}
            w="100%"
            textAlign="left"
            variant="outline"
            bg="white"
            fontWeight="normal"
            _hover={{ bg: "none", cursor: "pointer" }}
            _expanded={{ bg: "none" }}
            _focus={{ boxShadow: "none" }}
            border={isInvalid ? "2px solid" : "1px solid"}
            borderColor={isInvalid ? "red.500" : "gray.200"}
          >
            <HStack justifyContent="space-between">
              <Text>
                {options.find((opt) => opt.value === value)?.label ||
                  placeholder}
              </Text>
              <Icon
                as={ChevronDownIcon}
                position="absolute"
                right="0.6rem"
                top="50%"
                transform="translateY(-50%)"
                pointerEvents="none"
                boxSize={5}
              />
            </HStack>
          </MenuButton>

          <AnimatePresence>
            {isOpen && (
              <MotionMenuList
                key="menu"
                py={0}
                zIndex={20}
                bg="white"
                border="1px solid #E2E8F0"
                borderRadius="md"
                boxShadow="md"
                maxH="200px"
                overflowY="auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {options.map((opt, index) =>
                  opt.isGroupLabel ? (
                    <Box
                      key={`group-${index}`}
                      px={4}
                      py={2}
                      fontWeight="semibold"
                    >
                      {opt.label}
                    </Box>
                  ) : (
                    <MenuItem
                      key={opt.value}
                      onClick={() => onChange(opt.value)}
                      _hover={{ bg: "gray.100" }}
                      pl={6}
                    >
                      {opt.label}
                    </MenuItem>
                  )
                )}
              </MotionMenuList>
            )}
          </AnimatePresence>
        </Box>
      )}
    </Menu>
  );
}
