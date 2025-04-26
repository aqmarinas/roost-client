import Input from "../../../../components/atom/Input/index.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useForm } from "react-hook-form";
import Modal from "../../../../components/ui/Modal/index.jsx";

export default function CreateModal({ isOpen, onClose, onCreate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    onCreate(data), reset();
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
            autofocus
          />

          <Button
            variant="default"
            size="sm"
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
