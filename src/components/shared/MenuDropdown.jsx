import { Box, VStack, Text, Link as ChakraLink, Grid } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import { Link as RouterLink } from "react-router-dom";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

import Container from "./Container";

const MotionBox = motion(Box);

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const MenuDropdown = forwardRef(
  (
    {
      isOpen,
      title,
      items = [],
      columns = 4,
      seeAllHref,
      onClose,
      seeAllLabel,
    },
    ref
  ) => {
    const isGrouped =
      items.length && typeof items[0] === "object" && items[0].heading;

    const navigate = useNavigate();

    return (
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            ref={ref}
            position="absolute"
            width="100vw"
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            py={8}
            zIndex="999"
            boxShadow="0 10px 15px -3px rgba(0,0,0,0.1)"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Container>
              <VStack align="start" spacing={8} width="100%">
                {title && (
                  <Text fontWeight="bold" fontSize="md">
                    {title}
                  </Text>
                )}
                <Grid
                  templateColumns={`repeat(${
                    isGrouped ? items.length : columns
                  }, 1fr)`}
                  gap={12}
                  width="100%"
                >
                  {isGrouped
                    ? items.map((section, i) => (
                        <VStack
                          key={i}
                          align="start"
                          spacing={3}
                          flex="1"
                          minW="0"
                        >
                          <Text fontWeight="bold" fontSize="sm">
                            {section.heading}
                          </Text>
                          {section.items.map((item, j) => (
                            <ChakraLink
                              as="button"
                              fontSize="sm"
                              key={j}
                              onClick={() => {
                                onClose?.();
                                {
                                  item === designers &&
                                    navigate(
                                      `/shop?query=${encodeURIComponent(item)}`
                                    );
                                }
                              }}
                            >
                              {item}
                            </ChakraLink>
                          ))}
                        </VStack>
                      ))
                    : (() => {
                        const rows = Math.ceil(items.length / columns);
                        const verticalChunks = Array.from(
                          { length: columns },
                          (_, colIdx) =>
                            items.slice(colIdx * rows, colIdx * rows + rows)
                        );

                        return verticalChunks.map((chunk, colIdx) => (
                          <VStack
                            key={colIdx}
                            align="start"
                            spacing={3}
                            flex="1"
                            minW="0"
                          >
                            {chunk.map((item, i) => (
                              <ChakraLink
                                as="button"
                                fontSize="sm"
                                key={i}
                                onClick={() => {
                                  onClose?.();
                                  navigate(
                                    `/shop?query=${encodeURIComponent(item)}`
                                  );
                                }}
                              >
                                {item}
                              </ChakraLink>
                            ))}
                          </VStack>
                        ));
                      })()}
                </Grid>
                {seeAllHref && (
                  <ChakraLink
                    as={RouterLink}
                    to={seeAllHref}
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    _hover={{ textDecoration: "underline" }}
                    onClick={onClose}
                  >
                    See all {seeAllLabel || "items"}
                  </ChakraLink>
                )}
              </VStack>
            </Container>
          </MotionBox>
        )}
      </AnimatePresence>
    );
  }
);

export default MenuDropdown;
