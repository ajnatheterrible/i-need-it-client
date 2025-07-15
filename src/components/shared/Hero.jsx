import { Box } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Box as="section" w="100%" overflow="hidden">
      <Box
        as="video"
        src="/assets/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        w="100%"
        maxH="320px"
        objectFit="cover"
      />
    </Box>
  );
}
