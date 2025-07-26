import {
  Box,
  Grid,
  GridItem,
  VStack,
  Text,
  Heading,
  HStack,
  Button,
  Divider,
  Link,
  Tooltip,
  useDisclosure,
  Spinner,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { InfoOutlineIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";
import AccountSidebar from "../../components/sidebars/AccountSidebar";
import AddressModal from "../../components/modals/AddressModal";

import useAuthStore from "../../store/authStore";
import useFetchAddresses from "../../hooks/useFetchAddresses";

import { useState } from "react";

export default function Addresses() {
  const [editTarget, setEditTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, error } = useFetchAddresses();

  const token = useAuthStore((s) => s.token);
  const addresses = useAuthStore((s) => s.fetchedData?.addresses);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFetchedData({ addresses: data });
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Container>
        <Grid templateColumns="repeat(12, 1fr)" gap={8} py={10}>
          <GridItem colSpan={2}>
            <AccountSidebar />
          </GridItem>

          <GridItem colSpan={10}>
            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="60vh"
                w="full"
              >
                <Spinner size="xl" thickness="4px" color="gray.300" />
              </Box>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <HStack justify="space-between" mb={8}>
                  <Heading size="md">Addresses</Heading>
                  <Button
                    fontSize="xs"
                    fontWeight="semibold"
                    size="sm"
                    variant="outline"
                    onClick={onOpen}
                  >
                    + ADD NEW ADDRESS
                  </Button>
                </HStack>

                <VStack spacing={10} align="start" fontSize="sm" w="full">
                  {/* Default Return Address */}
                  <Box w="100%">
                    <HStack spacing={3} mb={1} align="center">
                      <Heading size="sm">Default Return Address</Heading>
                      <Tooltip
                        label="The address you ship packages from when selling"
                        fontSize="xs"
                        bg="gray.50"
                        color="gray.500"
                        borderRadius="md"
                      >
                        <Box>
                          <Icon
                            as={InfoOutlineIcon}
                            color="gray.500"
                            boxSize={4}
                          />
                        </Box>
                      </Tooltip>
                    </HStack>

                    {addresses?.length > 0 &&
                    addresses.some((a) => a.isDefaultShipping) ? (
                      (() => {
                        const addr = addresses.find((a) => a.isDefaultShipping);
                        return (
                          <VStack align="start" spacing={1}>
                            <Text>{addr.fullName}</Text>
                            <Text>{addr.line1}</Text>
                            {addr.line2 && <Text>{addr.line2}</Text>}
                            <Text color="gray.500">{`${addr.city.trim()}, ${addr.state.toUpperCase()} ${
                              addr.zip
                            }`}</Text>
                            <Text color="gray.500">{addr.country}</Text>
                            {addr.phone && <Text>{addr.phone}</Text>}
                          </VStack>
                        );
                      })()
                    ) : (
                      <Text color="gray.400" fontSize="sm">
                        You haven’t added any addresses yet
                      </Text>
                    )}
                  </Box>

                  {/* All Shipping Addresses */}
                  <Box w="100%">
                    <HStack spacing={3} mb={1} align="center">
                      <Heading size="sm">All Shipping Addresses</Heading>
                      <Tooltip
                        label="Your address options for purchases"
                        fontSize="xs"
                        bg="gray.50"
                        color="gray.500"
                        borderRadius="md"
                      >
                        <Box>
                          <Icon
                            as={InfoOutlineIcon}
                            color="gray.500"
                            boxSize={4}
                          />
                        </Box>
                      </Tooltip>
                    </HStack>

                    {addresses?.length > 0 ? (
                      addresses.map((a, i) => (
                        <VStack align="start" spacing={1} key={i} mb={6}>
                          <Text>{a.fullName}</Text>
                          <Text>{a.line1}</Text>
                          {a.line2 && <Text>{a.line2}</Text>}
                          <Text color="gray.500">{`${a.city.trim()}, ${a.state.toUpperCase()} ${
                            a.zip
                          }`}</Text>
                          <Text color="gray.500">{a.country}</Text>
                          {a.phone && <Text>{a.phone}</Text>}
                          <Link
                            color="blue.500"
                            fontWeight="semibold"
                            fontSize="xs"
                            mt={2}
                            onClick={() => {
                              setEditTarget(a);
                              onOpen();
                            }}
                          >
                            Edit
                          </Link>
                          <Divider w="25%" mt={4} />
                        </VStack>
                      ))
                    ) : (
                      <Text color="gray.400" fontSize="sm">
                        You haven’t added any addresses yet
                      </Text>
                    )}
                  </Box>
                </VStack>
              </motion.div>
            )}
          </GridItem>
        </Grid>
      </Container>
      <Footer />
      <AddressModal
        isOpen={isOpen}
        onClose={() => {
          setEditTarget(null);
          onClose();
        }}
        mode={editTarget ? "edit" : "add"}
        existingAddress={editTarget}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
