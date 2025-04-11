import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import BookModal from "../../../pages/public/HomePage/BookModal";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rooms", href: "/rooms" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  return (
    <header className="sticky bg-white shadow-sm inset-x-0 top-0 z-40 ">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="-m-1.5 p-1.5 text-indigo-600 font-bold text-2xl"
          >
            <span className="sr-only">Roost</span>
            Roost
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon
              aria-hidden="true"
              className="size-6"
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            const isCurrent = item.href === location.pathname;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`${isCurrent ? "text-indigo-600" : "text-gray-900 "} hover:text-gray-500 text-sm/6 font-semibold`}
              >
                {item.name}
              </a>
            );
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Book a Room
          </button>
        </div>
        {isModalOpen && (
          <BookModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="-m-1.5 p-1.5 text-indigo-600 font-bold text-2xl"
            >
              <span className="sr-only">Roost</span>
              Roost
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon
                aria-hidden="true"
                className="size-6"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
