import { Box, Text, Link, VStack } from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";

export default function Accessibility() {
  return (
    <>
      <Container>
        <VStack align="start" spacing={6} py={10}>
          <Text fontSize="3xl" fontWeight="bold">
            Our Commitment to Accessibility
          </Text>
          <Text>
            We aim to make I Need It's website experience usable and welcoming
            for everyone, including individuals with disabilities. If you're
            having trouble accessing any part of the site, navigating its
            content, or using a specific feature, we want to hear from you.
          </Text>
          <Text>
            Please email us at{" "}
            <Link href="mailto:accessibility@ineedit.app" color="blue.500">
              accessibility@ineedit.app
            </Link>{" "}
            and include the subject line “Accessibility Feedback.” Let us know
            what part of the site you're having trouble with and how we can
            improve.
          </Text>
          <Text>
            Your feedback helps us continue to improve accessibility across our
            platform. While third-party tools and content are outside our direct
            control, we actively encourage all vendors and partners to
            prioritize accessibility in their own platforms as well.
          </Text>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
