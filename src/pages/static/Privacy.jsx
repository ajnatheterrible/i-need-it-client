import { Box, Text, VStack, Link } from "@chakra-ui/react";
import Container from "../../components/shared/Container";
import Footer from "../../components/layout/Footer";

export default function Privacy() {
  return (
    <>
      <Container>
        <VStack align="start" spacing={6} py={10}>
          <Text fontSize="3xl" fontWeight="bold">
            Privacy Notice
          </Text>

          <Text>
            This Privacy Notice explains how I Need It collects, uses, and
            shares your personal information when you use our platform. This
            includes the website, mobile app, and any services we provide
            through them. By using our services, you agree to the practices
            outlined here.
          </Text>

          <Text fontWeight="semibold">What We Collect</Text>
          <Text>
            We may collect information you provide directly, such as your name,
            email, shipping address, payment method, and account preferences. We
            also collect information automatically through your use of the
            site—like IP address, device data, and usage stats—to improve our
            services.
          </Text>

          <Text fontWeight="semibold">How We Use Information</Text>
          <Text>
            Your information helps us run and personalize your experience,
            process transactions, detect fraud, communicate updates, and provide
            support. We also use data for analytics, legal compliance, and
            advertising (as outlined below).
          </Text>

          <Text fontWeight="semibold">Cookies and Tracking</Text>
          <Text>
            We use cookies and similar tools to track usage, remember
            preferences, and show you relevant content. You can manage cookie
            preferences in your browser settings.
          </Text>

          <Text fontWeight="semibold">When We Share Information</Text>
          <Text>
            We only share data when needed—such as with payment processors,
            service providers, or legal authorities. We do not sell your
            personal information.
          </Text>

          <Text fontWeight="semibold">Your Choices</Text>
          <Text>
            You can update your information anytime in your account settings.
            You may also request that we delete your account or limit certain
            uses of your data by contacting us.
          </Text>

          <Text fontWeight="semibold">Third-Party Content and Links</Text>
          <Text>
            Our site may link to other platforms or embed third-party features.
            We are not responsible for their privacy practices. Please review
            their notices if you engage with them.
          </Text>

          <Text fontWeight="semibold">Data Retention</Text>
          <Text>
            We keep your information only as long as necessary to fulfill the
            purposes we collected it for or to meet legal requirements. You can
            ask us to delete it sooner if you wish.
          </Text>

          <Text fontWeight="semibold">Children’s Privacy</Text>
          <Text>
            Our platform is not intended for children under 13. If we discover
            we’ve collected data from someone under that age, we will delete it.
          </Text>

          <Text fontWeight="semibold">Changes to This Policy</Text>
          <Text>
            We may update this policy over time. If we make significant changes,
            we’ll notify you via email or in-app. Your continued use of our
            services means you accept the new terms.
          </Text>

          <Text fontWeight="semibold">Contact Us</Text>
          <Text>
            If you have any questions about this Privacy Notice or want to
            exercise your privacy rights, email us at{" "}
            <Link href="mailto:privacy@ineedit.app" color="blue.500">
              privacy@ineedit.app
            </Link>
            .
          </Text>
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
