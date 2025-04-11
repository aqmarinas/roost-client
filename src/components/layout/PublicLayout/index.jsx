import React from "react";
import Navbar from "../Navbar";
import Container from "../../layout/Container";
import Footer from "../Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
