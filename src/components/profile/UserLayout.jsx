import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Container from "../shared/Container";
import UserProfileHeader from "./UserProfileHeader";
import Footer from "../layout/Footer";

export default function UserLayout() {
  return (
    <>
      <Container>
        <UserProfileHeader />
        <Box>
          <Outlet />
        </Box>
      </Container>
      <Footer />
    </>
  );
}
