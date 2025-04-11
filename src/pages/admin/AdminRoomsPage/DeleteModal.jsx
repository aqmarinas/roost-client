"use client";
import { toast } from "react-hot-toast";
import ModalDialog from "../../../components/ui/ModalDialog";

export default function DeleteModal({ open, onClose, roomId, onSuccess }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/rooms/${roomId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete room");
      }

      toast.success("Successfully deleted room");
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
      message="Are you sure you want to delete this room?"
    />
  );
}
