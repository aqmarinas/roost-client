import ContactModal from "@/components/ui/Modal/ContactModal";
import PrivacyModal from "@/components/ui/Modal/PrivacyModal";
import TermsModal from "@/components/ui/Modal/TermsModal";
import { useState } from "react";

export default function Footer() {
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  return (
    <>
      <footer className="border-t border-gray-200">
        <div className="mx-auto w-full p-8 md:flex md:items-center md:justify-between ">
          <div className="flex justify-center gap-x-6 md:order-2 text-gray-600 text-sm/6">
            <div
              onClick={() => setOpenTerms(true)}
              className="cursor-pointer hover:text-gray-900"
            >
              Terms
            </div>
            <div
              onClick={() => setOpenPrivacy(true)}
              className="cursor-pointer hover:text-gray-900"
            >
              Privacy
            </div>
            <div
              onClick={() => setOpenContact(true)}
              className="cursor-pointer hover:text-gray-900"
            >
              Contact
            </div>
          </div>
          <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0">&copy; {new Date().getFullYear()} PT XYZ, Inc. All rights reserved.</p>
        </div>
      </footer>

      {openContact && (
        <ContactModal
          isOpen={openContact}
          onClose={() => setOpenContact(false)}
        />
      )}
      {openTerms && (
        <TermsModal
          isOpen={openTerms}
          onClose={() => setOpenTerms(false)}
        />
      )}
      {openPrivacy && (
        <PrivacyModal
          isOpen={openPrivacy}
          onClose={() => setOpenPrivacy(false)}
        />
      )}
    </>
  );
}
