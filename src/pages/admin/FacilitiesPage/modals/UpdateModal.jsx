import { useEffect } from "react";
import Input from "../../../../components/atom/Input/";
import { Button } from "@/components/ui/button.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../../components/ui/Modal/index.jsx";

export default function UpdateModal({ isOpen, onClose, facility, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    if (facility && isOpen) {
      setValue("name", facility.name);
    }
  }, [facility, isOpen, setValue]);

  const onSubmit = async (data) => {
    onSuccess(data), reset(), onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
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
        import {Button} from "@/components/ui/button.jsx";
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
