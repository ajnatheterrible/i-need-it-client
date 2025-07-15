import { Box, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRef, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import MenuDropdown from "../shared/MenuDropdown";
import Container from "../shared/Container";

import categoryMap from "../../data/categoryMap";
import designers from "../../data/designers";

const navLinks = [
  { label: "DESIGNERS", key: "designers" },
  { label: "MENSWEAR", key: "menswear" },
  { label: "WOMENSWEAR", key: "womenswear" },
  { label: "SNEAKERS", key: "sneakers", path: "/sneakers" },
  { label: "EDITORIAL", key: "editorial", path: "/editorial" },
  { label: "COLLECTIONS", key: "collections", path: "/collections" },
];

const menswearItems = Object.entries(categoryMap["Menswear"]).map(
  ([heading, items]) => ({ heading, items })
);
const womenswearItems = Object.entries(categoryMap["Womenswear"]).map(
  ([heading, items]) => ({ heading, items })
);

export default function NavSubMenu() {
  const [activeMenu, setActiveMenu] = useState(null);

  const refs = {
    designers: { trigger: useRef(), dropdown: useRef() },
    menswear: { trigger: useRef(), dropdown: useRef() },
    womenswear: { trigger: useRef(), dropdown: useRef() },
  };

  useEffect(() => {
    function handleClickOutside(e) {
      Object.entries(refs).forEach(([key, { trigger, dropdown }]) => {
        if (
          activeMenu === key &&
          dropdown.current &&
          !dropdown.current.contains(e.target) &&
          trigger.current &&
          !trigger.current.contains(e.target)
        ) {
          setActiveMenu(null);
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  return (
    <>
      {" "}
      <Container>
        <HStack
          justify="space-between"
          py={4}
          fontSize="xs"
          fontWeight="semibold"
        >
          {navLinks.map(({ label, key, path }) => {
            const isDropdown =
              key === "designers" || key === "menswear" || key === "womenswear";

            if (isDropdown) {
              return (
                <Box key={key} position="relative">
                  <ChakraLink
                    ref={refs[key].trigger}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveMenu((prev) => (prev === key ? null : key));
                    }}
                    display="flex"
                    alignItems="center"
                    fontWeight="semibold"
                    cursor="pointer"
                    _hover={{
                      textDecoration: "none",
                      textShadow: "0 0 8px #DCEF31",
                    }}
                  >
                    {label} <ChevronDownIcon ml={1} />
                  </ChakraLink>
                </Box>
              );
            }

            return (
              <ChakraLink
                key={key}
                as={RouterLink}
                to={path}
                _hover={{ textDecoration: "underline" }}
              >
                {label}
              </ChakraLink>
            );
          })}
        </HStack>
      </Container>
      <MenuDropdown
        isOpen={activeMenu === "designers"}
        title="Shop Popular Designers"
        items={designers}
        columns={4}
        seeAllHref="/designers"
        ref={refs.designers.dropdown}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Designers"
      />
      <MenuDropdown
        isOpen={activeMenu === "menswear"}
        title="Shop by Category"
        items={menswearItems}
        columns={4}
        seeAllHref="/menswear"
        ref={refs.menswear.dropdown}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Categories"
      />
      <MenuDropdown
        isOpen={activeMenu === "womenswear"}
        title="Shop by Category"
        items={womenswearItems}
        columns={4}
        seeAllHref="/womenswear"
        ref={refs.womenswear.dropdown}
        onClose={() => setActiveMenu(null)}
        seeAllLabel="Categories"
      />
    </>
  );
}
