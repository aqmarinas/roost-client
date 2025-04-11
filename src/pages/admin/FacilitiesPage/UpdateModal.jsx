"use client";

import { useEffect, useState } from "react";
import Input from "../../../components/atom/Input/index.jsx";
import Button from "../../../components/atom/Button/index.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal/index.jsx";
import { toast } from "react-hot-toast";

export default function UpdateModal({ open, onClose, facility, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    if (facility && open) {
      setValue("name", facility.name);
    }
  }, [facility, open, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/facilities/${facility.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update facility");
      }

      toast.success("Successfully updated facility");
      onSuccess();
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
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Facility"
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
        />

        <Button
          text={isSubmitting ? "Updating..." : "Update"}
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}
