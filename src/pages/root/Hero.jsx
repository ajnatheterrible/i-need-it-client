import { useState } from "react";
import { Box } from "@chakra-ui/react";
import HeroSkeleton from "../../components/skeletons/HeroSkeleton";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Box as="section" w="100%" overflow="hidden" position="relative">
      {!isLoaded && <HeroSkeleton />}

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
        onCanPlayThrough={() => setIsLoaded(true)}
        display={isLoaded ? "block" : "none"}
      />
    </Box>
  );
}
