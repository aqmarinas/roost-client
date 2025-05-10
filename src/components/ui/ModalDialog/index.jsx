import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

export default function ModalDialog({ isOpen, onClose, title = "Confirm", message = "Are you sure you want to proceed? This action cannot be undone", confirmText = "Confirm", cancelText = "Cancel", onConfirm, type = "danger" }) {
  // Color configurations based on type
  const colorConfig = {
    danger: {
      bg: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-500 focus-visible:outline-red-600",
    },
    warning: {
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600",
    },
    success: {
      bg: "bg-green-100",
      iconColor: "text-green-600",
      button: "bg-green-600 hover:bg-green-500 focus-visible:outline-green-600",
    },
    info: {
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600",
    },
  };

  const { bg, iconColor, button } = colorConfig[type];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0">
            <div className={`rounded-full ${bg} p-2`}>
              <ExclamationTriangleIcon className={`h-6 w-6 ${iconColor}`} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>

        <div className="my-4 mx-2 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            className={`${button}`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
