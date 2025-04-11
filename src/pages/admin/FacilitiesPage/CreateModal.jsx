"use client";

import Input from "../../../components/atom/Input/index.jsx";
import Button from "../../../components/atom/Button/index.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal/index.jsx";
import toast from "react-hot-toast";

export default function CreateModal({ open, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/facilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add facility");
      }

      toast.success("Successfully added facility");
      reset();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Create Facility"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
            required
            autofocus
          />

          <Button
            text="Create"
            type="submit"
          />
        </form>
      </Modal>
    </>
  );
}
