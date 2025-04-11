"use client";

import { useEffect, useRef, useState } from "react";
import Input from "../../../components/atom/Input/index.jsx";
import Button from "../../../components/atom/Button/index.jsx";
import FacilitySelect from "./FacilitySelect.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal/index.jsx";
import { TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UpdateModal({ open, onClose, room, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (room && open) {
      setValue("name", room.name);
      setValue("location", room.location);
      setValue("capacity", room.capacity);
      setValue(
        "facilities",
        room.facilities.map((facility) => facility.id)
      );
      setValue("image", room.image);
      setImagePreview(`${import.meta.env.VITE_LOCAL_API}/${room.image}`);
    }
  }, [room, open, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    if (!imageFile && !room.image) {
      setSubmitError("Please upload an image");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("capacity", data.capacity);
      if (Array.isArray(data.facilities)) {
        data.facilities.forEach((facilityId, index) => {
          formData.append(`facilities[${index}]`, facilityId);
        });
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await fetch(`${import.meta.env.VITE_LOCAL_API}/rooms/${room.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update room");
      }

      toast.success("Room updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Room"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        {submitError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{submitError}</div>}

        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Room Name"
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />

        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Location"
          label="Location"
          {...register("location", { required: "Location is required" })}
          error={errors.location?.message}
        />

        <Input
          id="capacity"
          name="capacity"
          type="number"
          placeholder="Capacity"
          label="Capacity"
          {...register("capacity", {
            required: "Capacity is required",
            min: { value: 1, message: "Capacity must be at least 1" },
          })}
          error={errors.capacity?.message}
        />

        <FacilitySelect
          setValue={setValue}
          watch={watch}
          error={errors.facilities?.message}
        />

        <div className="mb-4">
          <label className="block text-sm/6 font-semibold text-gray-900 mb-1">
            Room Image <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {!imageFile && <p className="mt-1 text-sm text-red-600">{submitError === "Please upload an image" && submitError}</p>}
        </div>

        {imagePreview && (
          <div className="mt-4 relative">
            <div className="border border-gray-300 rounded-lg flex items-center justify-center p-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-48 rounded-lg object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-4 right-4 text-white rounded-full"
            >
              <TrashIcon className="size-5 text-gray-500 hover:text-gray-900" />
            </button>
          </div>
        )}

        <Button
          text={isSubmitting ? "Updating..." : "Update"}
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}
