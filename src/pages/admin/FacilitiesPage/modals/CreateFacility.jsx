import Input from "@/components/form/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";

export default function CreateModal({ isOpen, onClose, onCreate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldFocusError: true,
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    await onCreate(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
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
          />

          <Button
            fullWidth
            className="mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
