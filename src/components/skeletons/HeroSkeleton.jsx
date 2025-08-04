import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const shimmerKeyframes = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export default function HeroSkeleton() {
  return (
    <Box
      w="100%"
      h="320px"
      borderRadius="none"
      bg="gray.200"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background:
          "linear-gradient(90deg, rgba(240,240,240,0) 0%, rgba(255,255,255,0.6) 50%, rgba(240,240,240,0) 100%)",
        backgroundSize: "200% 100%",
        animation: `${shimmerKeyframes} 2s infinite`,
      }}
    />
  );
}
