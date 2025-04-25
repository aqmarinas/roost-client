import ModalDialog from "../../../../components/ui/ModalDialog";

export default function ApproveModal({ isOpen, onClose, onSuccess }) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onSuccess}
      type="info"
      title="Confirm Approve"
      message="Are you sure you want to approve this booking?"
      confirmText="Approve"
    />
  );
}
