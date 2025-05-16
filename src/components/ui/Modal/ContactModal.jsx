import { Phone, Mail, User } from "lucide-react";
import Modal from ".";

const admins = [
  {
    name: "Lorem Ipsum",
    email: "admin1@xyz.com",
    phone: "+62 812-1111-1111",
    whatsapp: "6281211111111",
  },
  {
    name: "Dolor Sit ",
    email: "admin2@xyz.com",
    phone: "+62 812-2222-2222",
    whatsapp: "6281222222222",
  },
  {
    name: "Amet Consectetur",
    email: "admin3@xyz.com",
    phone: "+62 812-3333-3333",
    whatsapp: "6281233333333",
  },
];

export default function ContactModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact"
    >
      <div className="space-y-3 text-sm text-gray-700">
        <p>If you have any questions, reach us at:</p>
        <div className="space-y-4">
          {admins.map((admin, index) => (
            <div
              key={index}
              className="space-y-1 border-2 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <strong>Admin {index + 1}:</strong>
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <span>{admin.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <a
                  className="hover:text-gray-900"
                  target="_blank"
                  href={`mailto:${admin.email}`}
                >
                  {admin.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <a
                  className="hover:text-gray-900"
                  target="_blank"
                  href={`https://wa.me/${admin.whatsapp}`}
                >
                  {admin.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
