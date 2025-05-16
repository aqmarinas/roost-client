import Modal from ".";

const privacyList = [
  {
    title: "Data Collected",
    description: "We collect your name, email, phone number, and booking details to process your reservation and ensure room availability.",
  },
  {
    title: "Purpose of Use",
    description: "Your data is used only for managing meeting room bookings and sending confirmation or OTP messages.",
  },
  {
    title: "Third-Party Services",
    description: "We may use third-party services (e.g. WhatsApp, email providers) to facilitate communication. These services are subject to their own privacy policies.",
  },
  {
    title: "Data Security",
    description: "We implement security measures to protect your data. However, no system is 100% secure.",
  },
];

export default function PrivacyModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
    >
      <div className="space-y-2 text-sm">
        <ol
          className="list-decimal list-inside mt-2 space-y-3"
          type="1"
        >
          {privacyList.map((privacy, index) => (
            <li
              key={index}
              className="font-medium"
            >
              <span>{privacy.title}</span>
              <p className="mt-1 font-normal text-gray-500">{privacy.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
