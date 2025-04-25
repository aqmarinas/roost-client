import ModalDialog from "../../../../components/ui/ModalDialog";

export default function RejectModal({ isOpen, onClose, onSuccess }) {
  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onSuccess}
      title="Confirm Reject"
      message="Are you sure you want to reject this booking? This action can't be undone."
      confirmText="Reject"
      type="warning"
    />
  );
}
