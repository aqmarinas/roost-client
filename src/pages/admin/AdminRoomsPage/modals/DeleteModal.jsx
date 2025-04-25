import ModalDialog from "../../../../components/ui/ModalDialog";

export default function DeleteModal({ isOpen, onClose, onSuccess }) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onSuccess}
      title="Confirm Delete"
      message="Are you sure you want to delete this room?"
    />
  );
}
