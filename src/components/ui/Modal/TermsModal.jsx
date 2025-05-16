import Modal from ".";

const termsList = [
  {
    title: "Agreement",
    description: "By booking a room, you agree to comply with these Terms of Use. If you do not agree, please do not proceed.",
  },
  {
    title: "Usage",
    description: "This service is intended for internal use by employees of [Your Company Name]. Bookings must be made responsibly and for valid meeting purposes.",
  },
  {
    title: "Cancelations",
    description: "You are responsible for cancelling bookings you no longer need. Misuse (e.g. repeated no-shows) may result in access restrictions.",
  },
  {
    title: "Availability",
    description: "Room availability is subject to change. Booking is only confirmed after successful submission.",
  },
  {
    title: "Changes",
    description: "We may modify these terms at any time. Continued use implies acceptance of the updated terms.",
  },
];

export default function TermsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Use"
    >
      <div className="space-y-2 text-sm">
        <ol
          className="list-decimal list-inside mt-2 space-y-3"
          type="1"
        >
          {termsList.map((term, index) => (
            <li
              key={index}
              className="font-medium"
            >
              <span>{term.title}</span>
              <p className="mt-1 font-normal text-gray-500">{term.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
