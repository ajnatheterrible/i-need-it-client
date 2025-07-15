import {
  Box,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import KlarnaSvg from "../../../public/assets/logos/KlarnaSvg";
import AffirmSvg from "../../../public/assets/logos/AffirmSvg";

const KlarnaAffirmModal = ({ isOpen, onClose, price }) => {
  const formattedPrice = Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const plans = [
    {
      label: `12 payments of $${((price / 12) * 1.1399).toFixed(
        2
      )} monthly, 13.99% APR`,
      total: (price * 1.0774).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      provider: "Klarna",
    },
    {
      label: `12 payments of $${((price / 12) * 1.1498).toFixed(
        2
      )} monthly, 14.98% APR`,
      total: (price * 1.083).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      provider: "Affirm",
    },
    {
      label: `6 payments of $${((price / 6) * 1.1399).toFixed(
        2
      )} monthly, 13.99% APR`,
      total: (price * 1.0412).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      provider: "Klarna",
    },
    {
      label: `6 payments of $${((price / 6) * 1.1493).toFixed(
        2
      )} monthly, 14.93% APR`,
      total: (price * 1.044).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      provider: "Affirm",
    },
    {
      label: `4 payments of $${(price / 4).toFixed(
        2
      )} every 2 weeks, interest-free`,
      total: formattedPrice,
      provider: "Klarna + Affirm",
    },
    {
      label: `3 payments of $${((price / 3) * 1.1399).toFixed(
        2
      )} monthly, 13.99% APR`,
      total: (price * 1.0234).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      provider: "Klarna",
    },
    {
      label: "Pay now in full",
      total: formattedPrice,
      provider: "Klarna",
    },
  ];

  const renderProviderIcon = (provider) => {
    if (provider === "Klarna") return <KlarnaSvg height="16" />;
    if (provider === "Affirm") return <AffirmSvg height="16" />;
    if (provider === "Klarna + Affirm") {
      return (
        <HStack spacing={2} align="center">
          <KlarnaSvg height="16" />
          <AffirmSvg height="16" />
        </HStack>
      );
    }
    return null;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent borderRadius="md" overflow="hidden" px={0} py={0}>
          <ModalCloseButton
            top="16px"
            right="16px"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
          />

          <ModalBody p={6}>
            <VStack align="start" spacing={4}>
              <VStack align="center" w="100%">
                <Heading fontSize="lg">Choose how you want to pay</Heading>
                <Text fontSize="sm" mt={1}>
                  Purchase price:{" "}
                  <Text as="span" fontWeight="semibold">
                    ${formattedPrice}
                  </Text>
                </Text>

                <Text fontSize="sm">
                  Select Klarna or Affirm as your payment method to pay in
                  installments
                </Text>
              </VStack>
              <Box maxH="300px" w="100%" overflowY="auto" pr={1}>
                <VStack spacing={3} w="100%">
                  {plans.map((plan, i) => (
                    <Box
                      key={i}
                      w="100%"
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      _hover={{ borderColor: "gray.400" }}
                      transition="border-color 0.2s"
                    >
                      <HStack justify="space-between" align="start">
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">
                            {plan.label}
                          </Text>
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            Total: ${plan.total}
                          </Text>
                        </Box>

                        {renderProviderIcon(plan.provider)}
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Text fontSize="xs" color="gray.500" pt={4}>
                Klarna: Pay monthly financing available through Klarna, Inc. is
                issued by WebBank. It’s available to eligible US residents in
                most states. Rates (7.99%–33.99% APR) are based on your credit.
                Missed payments are subject to late fees. Review Klarna’s{" "}
                <Link
                  href="https://www.klarna.com/us/legal/"
                  isExternal
                  color="gray.600"
                  textDecoration="underline"
                  cursor="pointer"
                >
                  terms
                </Link>
                . Pay in 4 is offered by Klarna, Inc. It’s available to eligible
                US residents in most states. Initial payments may be higher.
                Missed payments are subject to late fees. For CA residents,
                loans made or arranged by Klarna, Inc. pursuant to a California
                Financing Law license.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default KlarnaAffirmModal;
