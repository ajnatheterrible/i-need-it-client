import {
  Box,
  Grid,
  GridItem,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Button,
  Divider,
  Link,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiArrowRight } from "react-icons/fi";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";

const helpSections = [
  {
    title: "I Need It 101",
    description: "Important information before getting started with I Need It.",
  },
  {
    title: "Trust and Safety",
    description: "I Need It authentication, safety and reporting a bug.",
  },
  {
    title: "Manage my Account",
    description: "Get help with account updates, tax information and more.",
  },
  {
    title: "Selling",
    description: "Everything you need to know to become a I Need It Seller.",
  },
  {
    title: "Orders, Shipping and Returns",
    description: "Buy safely, manage your orders and find return info.",
  },
];

const promotedArticles = [
  "What are Curators and Closets?",
  "What are I Need It Labels?",
  "I Need It’s Purchase Protection",
  "Tariffs",
  "What is a 1099-K?",
  "How do I onboard with Stripe?",
  "Does I Need It have Expedited Shipping?",
  "Shipping Policy",
];

const generalTopics = [
  { category: "Taxes, Duties and Fees", article: "Tariffs" },
  { category: "Trust and Safety", article: "How can I buy safely?" },
  {
    category: "Trust and Safety",
    article: "Does I Need It allow replicas or inauthentic items?",
  },
  {
    category: "Trust and Safety",
    article: "How do I report a bug, listing or user?",
  },
  { category: "Trust and Safety", article: "I Need It’s Bug Bounty Program" },
];

export default function Help() {
  return (
    <>
      <Container>
        <VStack spacing={10} py={10} align="stretch">
          <Box textAlign="center">
            <InputGroup maxW="600px" mx="auto">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input placeholder="How can we help?" />
            </InputGroup>
          </Box>

          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            {helpSections.map((section, i) => (
              <Box
                key={i}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                _hover={{ boxShadow: "md" }}
                transition="box-shadow 0.2s"
              >
                <Text fontWeight="semibold">{section.title}</Text>
                <Text fontSize="sm" color="gray.600">
                  {section.description}
                </Text>
              </Box>
            ))}
          </Grid>

          <Box>
            <Text fontWeight="semibold" mb={4}>
              Promoted articles
            </Text>
            <Grid
              templateColumns="repeat(auto-fit, minmax(240px, 1fr))"
              gap={3}
            >
              {promotedArticles.map((article, i) => (
                <Link
                  href="#"
                  key={i}
                  fontSize="sm"
                  color="gray.800"
                  _hover={{ textDecor: "underline" }}
                >
                  {article}
                </Link>
              ))}
            </Grid>
          </Box>

          <Box>
            <Divider my={6} />
            <Text fontWeight="semibold" mb={4}>
              General help topics
            </Text>
            <VStack align="start" spacing={4}>
              {generalTopics.map((topic, i) => (
                <Box key={i}>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    {topic.category}
                  </Text>
                  <Link
                    href="#"
                    fontSize="sm"
                    color="gray.800"
                    _hover={{ textDecor: "underline" }}
                  >
                    {topic.article}
                  </Link>
                </Box>
              ))}
              <Link
                href="#"
                color="blue.500"
                fontSize="sm"
                display="inline-flex"
                alignItems="center"
                mt={2}
              >
                See more <Icon as={FiArrowRight} ml={1} />
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
