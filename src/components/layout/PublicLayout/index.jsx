import Navbar from "../Navbar";
import Container from "@/components/layout/Container";
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
