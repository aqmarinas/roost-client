import Navbar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function PublicLayout({ children }) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ className: "text-sm" }}
      />
      <Navbar />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
