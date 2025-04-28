import ModalDialog from "../../../../components/ui/ModalDialog";

export default function DeleteModal({ isOpen, onClose, onSuccess }) {
  const handleConfirm = async () => {
    await onSuccess();
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirm Delete"
      message="Are you sure you want to delete this room?"
    />
  );
}
