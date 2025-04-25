import { useEffect, useRef, useState } from "react";
import Input from "../../../../components/atom/Input/index.jsx";
import { Button } from "@/components/ui/button.jsx";
import FacilitySelect from "../FacilitySelect.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../../components/ui/Modal/index.jsx";
import { TrashIcon } from "lucide-react";

export default function UpdateModal({ isOpen, onClose, room, onSuccess }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (room && isOpen) {
      setValue("name", room.name);
      setValue("location", room.location);
      setValue("capacity", room.capacity);
      setValue(
        "facilities",
        room.facilities.map((facility) => facility.id)
      );
      setValue("image", room.image);
      setImagePreview(`${import.meta.env.VITE_LOCAL_API}/${room.image}`);
      setImageFile({ name: room.image.split("\\").pop() });
    }
  }, [room, isOpen, setValue]);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImageFile(null);
    setImagePreview(null);
    setValue("image", null);
  };

  const onSubmit = async (data) => {
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
    onSuccess(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update Room"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
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

        {/* Image */}
        <div className="mb-4">
          <label className={`block text-sm/6 font-semibold text-gray-900 mb-1`}>Room Image</label>

          <div className={`relative border rounded-md p-0.5 ${errors?.image ? "border-red-500" : "border-gray-300"}`}>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className={`block w-full text-sm text-gray-500 opacity-0 absolute inset-0 z-20 cursor-pointer ${errors?.image ? "bg-red-50" : ""}`}
            />
            <div className={`flex items-center justify-between p-2 ${errors?.image ? "bg-red-50" : ""}`}>
              <span className={`text-sm ${imageFile ? "text-indigo-700 font-medium" : errors?.image ? "text-red-600" : "text-gray-500"}`}>{imageFile ? imageFile.name : "Choose an image..."}</span>
              <div className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 text-sm font-semibold">Browse</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG. Max size: 2MB.</p>
          {errors?.image && <p className="mt-1 text-sm text-red-600 flex items-center">{errors?.image.message}</p>}

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
                className="absolute top-4 right-4 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <TrashIcon className="size-5 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          fullWidth
          className="mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
}
