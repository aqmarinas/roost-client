"use client";
import { toast } from "react-hot-toast";
import ModalDialog from "../../../components/ui/ModalDialog";

export default function DeleteModal({ open, onClose, bookingId, onSuccess }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings/${bookingId}/delete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        boduy: JSON.stringify({
          status: "Deleted",
          is_deleted: true,
          updated_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking");
      }

      toast.success("Successfully deleted booking");
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
      onConfirm={handleDelete}
      title="Confirm Delete"
      message="Are you sure you want to delete this booking? This action can't be undone."
    />
  );
}
