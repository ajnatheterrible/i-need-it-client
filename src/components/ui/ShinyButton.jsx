import React from "react";
import { motion } from "framer-motion";
import { Button } from "@chakra-ui/react";

const MotionButton = motion(Button);

const animationProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    duration: 2,
    ease: "linear",
  },
};

export default function ShinyButton({ children, isSelected, ...rest }) {
  return (
    <MotionButton
      variant="outline"
      w="100%"
      h="40px"
      fontSize="xs"
      fontWeight="normal"
      borderColor={isSelected ? "black" : "gray.200"}
      position="relative"
      overflow="hidden"
      {...animationProps}
      {...rest}
    >
      <motion.span
        style={{
          WebkitMaskImage:
            "linear-gradient(-75deg, black calc(var(--x) + 20%), transparent calc(var(--x) + 30%), black calc(var(--x) + 100%))",
          maskImage:
            "linear-gradient(-75deg, black calc(var(--x) + 20%), transparent calc(var(--x) + 30%), black calc(var(--x) + 100%))",
        }}
      >
        {children}
      </motion.span>
    </MotionButton>
  );
}
