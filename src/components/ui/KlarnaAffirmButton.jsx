import { HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import KlarnaSvg from "../../../public/assets/logos/KlarnaSvg";
import AffirmSvg from "../../../public/assets/logos/AffirmSvg";

const KlarnaAffirmButton = ({ onOpen, price }) => {
  const iconColor = useColorModeValue("#1a1a1a", "#ffffff");
  const estimate = Math.ceil(price / 12).toLocaleString();

  return (
    <VStack
      w="100%"
      bg={useColorModeValue("gray.100", "gray.700")}
      align="center"
      spacing={2}
      p={2}
    >
      <HStack spacing={2} align="center">
        <KlarnaSvg height="18" />

        <AffirmSvg height="18" />
      </HStack>

      <HStack
        spacing={1}
        align="center"
        cursor="pointer"
        onClick={onOpen}
        _hover={{ textDecoration: "underline" }}
        transition="all 0.2s"
      >
        <Text fontSize="sm" color={iconColor}>
          As low as ${estimate}/month or interest-free
        </Text>
        <AiOutlineInfoCircle size={14} color={iconColor} />
      </HStack>
    </VStack>
  );
};

export default KlarnaAffirmButton;
