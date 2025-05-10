import ModalDialog from "@/components/ui/ModalDialog";

export default function RejectModal({ isOpen, onClose, onSuccess }) {
  const handleConfirm = async () => {
    await onSuccess();
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirm Reject"
      message="Are you sure you want to reject this booking? This action can't be undone"
      confirmText="Reject"
      type="warning"
    />
  );
}
