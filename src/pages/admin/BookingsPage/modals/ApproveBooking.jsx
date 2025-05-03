import ModalDialog from "@/components/ui/ModalDialog";

export default function ApproveModal({ isOpen, onClose, onSuccess }) {
  const handleConfirm = async () => {
    await onSuccess();
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      type="info"
      title="Confirm Approve"
      message="Are you sure you want to approve this booking?"
      confirmText="Approve"
    />
  );
}
