"use client";
import { toast } from "react-hot-toast";
import ModalDialog from "../../../components/ui/ModalDialog";

export default function RejectModal({ open, onClose, bookingId, onSuccess }) {
  const handleReject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${bookingId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        boduy: JSON.stringify({
          status: "Rejected",
          updated_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject booking");
      }

      toast.success("Successfully rejected booking");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      onConfirm={handleReject}
      title="Confirm Reject"
      message="Are you sure you want to reject this booking? This action can't be undone."
      confirmText="Reject"
      type="warning"
    />
  );
}
