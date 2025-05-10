import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const modalSizes = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  full: "sm:max-w-full",
};

export default function Modal({ isOpen, onClose, title, children, size = "lg", showCloseButton = true }) {
  const sizeClass = modalSizes[size] || modalSizes.lg;

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}}
      // onClose={onClose}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in pointer-events-auto"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <DialogPanel
          static
          className={`w-full rounded-xl bg-white p-6 shadow-2xl ${sizeClass} pointer-events-auto`}
          onClose={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between">
            {title ? (
              <>
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </DialogTitle>
                {showCloseButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-900 hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                )}
              </>
            ) : (
              showCloseButton && (
                <div className="ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-900 hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>
              )
            )}
          </div>

          <div className="max-h-[80vh] overflow-y-auto">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
