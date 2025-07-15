import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Progress,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";

import Container from "../components/shared/Container";
import Footer from "../components/layout/Footer";
import SellerSidebar from "../components/sidebars/SellerSidebar";
import SellerProfileHeader from "../components/profile/SellerProfileHeader";
import DraftsSkeleton from "../components/skeletons/DraftsSkeleton";
import DeleteDraftDialog from "../components/ui/DeleteDraftDialog";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Drafts() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDraftCompletionPercent = (draft) => {
    const requiredFields = [
      "title",
      "designer",
      "department",
      "category",
      "subCategory",
      "size",
      "countryOfOrigin",
      "color",
      "condition",
      "price",
      "images",
    ];

    let completed = 0;

    for (const field of requiredFields) {
      if (field === "images") {
        if (Array.isArray(draft.images) && draft.images.length > 0) {
          completed++;
        }
      } else if (draft[field]) {
        completed++;
      }
    }

    const percent = Math.round((completed / requiredFields.length) * 100);
    return percent;
  };

  const handleDeleteDraft = async (draftId) => {
    if (!draftId) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/market/delete-draft`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentals: "include",
        body: JSON.stringify({ draftId }),
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.message);
      }

      setDrafts((prev) => prev.filter((d) => d._id !== draftId));
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error deleting draft:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getDrafts = async () => {
      setIsLoading(true);

      try {
        const res = await fetch("/api/listings/get-drafts", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setDrafts(data);
        }
      } catch (err) {
        console.error("Failed to fetch drafts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getDrafts();
  }, []);

  return (
    <>
      <Container>
        <VStack align="start" spacing={4} py={10}>
          <SellerProfileHeader />

          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            pt={6}
            pb={10}
            w="full"
          >
            <GridItem colSpan={2}>
              <SellerSidebar active="DRAFTS" />
            </GridItem>

            <GridItem colSpan={10}>
              <VStack align="start" spacing={6} w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Drafts
                </Text>
                {isLoading ? (
                  <DraftsSkeleton />
                ) : drafts && drafts.length > 0 ? (
                  <SimpleGrid columns={[1, null, 2]} spacing={8} w="full">
                    {drafts.map((item) => {
                      const completion = getDraftCompletionPercent(item);

                      return (
                        <Box key={item._id} w="full" maxW="400px">
                          <Flex align="start" gap={4}>
                            <Box
                              w="120px"
                              h="120px"
                              bg="gray.200"
                              flexShrink={0}
                              mt="2px"
                              backgroundImage={`url(${item.thumbnail || ""})`}
                              backgroundSize="cover"
                              backgroundPosition="center"
                            />

                            <VStack align="start" spacing={3} w="full">
                              <Text fontSize="xs" color="gray.500" mt={0.5}>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </Text>

                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                noOfLines={2}
                              >
                                {item.title}
                              </Text>

                              <HStack spacing={2} w="full">
                                <Progress
                                  value={completion}
                                  size="xs"
                                  colorScheme="blue"
                                  flex={1}
                                />
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  whiteSpace="nowrap"
                                >
                                  {completion}% complete
                                </Text>
                              </HStack>
                            </VStack>
                          </Flex>

                          <VStack spacing={2} pt={3} w="full">
                            <Button
                              w="full"
                              size="sm"
                              bg="black"
                              color="white"
                              fontWeight="extrabold"
                              fontSize="xs"
                              textTransform="uppercase"
                              _hover={{ bg: "gray.800" }}
                              onClick={() =>
                                navigate(`/sell/draft/${item._id}`)
                              }
                            >
                              Review and Submit
                            </Button>

                            <DeleteDraftDialog
                              onConfirm={() => handleDeleteDraft(item._id)}
                              isSubmitting={isSubmitting}
                              page="drafts"
                            />
                          </VStack>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                ) : (
                  <Text fontSize="md" fontWeight="heavy">
                    You have no drafts
                  </Text>
                )}
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
