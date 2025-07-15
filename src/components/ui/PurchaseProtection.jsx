import {
  Box,
  Text,
  Collapse,
  useDisclosure,
  IconButton,
  List,
  ListItem,
  ListIcon,
  Link,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { MdCheckCircle } from "react-icons/md";

export const PurchaseProtection = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="white">
      <Text fontWeight="bold" fontSize="md" mb={2}>
        I Need It Purchase Protection
      </Text>
      <Text fontSize="sm" color="gray.600">
        We want you to feel safe buying and selling on I Need It. Qualifying
        orders are covered by our Purchase Protection in the rare case something
        goes wrong.
      </Text>

      <Flex
        mt={4}
        align="center"
        justify="space-between"
        onClick={onToggle}
        cursor="pointer"
      >
        <Text fontWeight="bold" fontSize="sm">
          How You're Protected
        </Text>
        <IconButton
          icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          variant="ghost"
          size="sm"
          aria-label="Toggle"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={3} fontSize="sm" color="gray.700">
          <Text mb={2}>Your purchase is covered if I Need It finds:</Text>
          <List spacing={2} pl={4}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="gray.500" />
              The item you purchased materially differs from its description in
              color, condition, fabric, and/or measurement.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="gray.500" />
              You were sent the wrong item.
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="gray.500" />
              The item's authenticity cannot be verified by us.
            </ListItem>
          </List>
          <Text mt={3}>
            For more information on I Need It Purchase Protection, please visit
            our{" "}
            <Link
              as={RouterLink}
              to="/help"
              color="gray.500"
              textDecoration="underline"
            >
              Help Center
            </Link>
            .
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
};
