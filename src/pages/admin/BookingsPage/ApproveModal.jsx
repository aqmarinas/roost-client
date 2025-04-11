"use client";
import { toast } from "react-hot-toast";
import ModalDialog from "../../../components/ui/ModalDialog";

export default function ApproveModal({ open, onClose, bookingId, onSuccess }) {
  const handleApprove = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${bookingId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        boduy: JSON.stringify({
          status: "Approved",
          updated_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to approve booking");
      }

      toast.success("Successfully approved booking");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      onConfirm={handleApprove}
      type="info"
      title="Confirm Approve"
      message="Are you sure you want to approve this booking?"
      confirmText="Approve"
    />
  );
}
