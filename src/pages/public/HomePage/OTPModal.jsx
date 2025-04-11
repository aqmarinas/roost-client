import React, { useState } from "react";
import Input from "../../../components/atom/Input";
import Button from "../../../components/atom/Button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";

export default function OTPModal({ open, onClose, bookingData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to book room");
      }

      toast.success("Room booked successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to book room");
    }
    onClose();
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
        title="Verify OTP"
      >
        <p className="text-sm text-gray-500">Please enter the verification code sent to your email:</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="otp"
            name="otp"
            type="text"
            placeholder="Enter verification code"
            {...register("otp", { required: "OTP is required" })}
            error={errors.otp?.message}
          />
          <Button
            text="Book Room"
            type="submit"
          />
        </form>
      </Modal>
    </>
  );
}
