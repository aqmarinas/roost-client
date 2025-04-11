"use client";

import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../Modal";

export default function ModalDialog({ open, onClose, title = "Confirm", message = "Are you sure you want to proceed? This action cannot be undone.", confirmText = "Confirm", cancelText = "Cancel", onConfirm, type = "danger" }) {
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
      open={open}
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

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 ${button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
