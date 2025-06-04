import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateModal from "@/pages/public/HomePage/BookModal";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Rooms", href: "/rooms" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header className="sticky bg-white shadow-sm inset-x-0 top-0 z-40 ">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a
              href="/"
              className="-m-1.5 p-1.5 text-indigo-600 font-bold text-2xl"
            >
              Roost
            </a>
          </div>
          <div className="flex lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-transparant"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="size-6" />
            </Button>
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
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
            <Button onClick={() => setOpenCreate(true)}>Book a Room</Button>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/login")}
            >
              Login (Admin)
            </Button>
          </div>
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
                Roost
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-transparant"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="size-6" />
              </Button>
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
                  <Separator className="my-2" />
                  <a
                    href="/admin/login"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Login (Admin)
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      {openCreate && (
        <CreateModal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      )}
    </>
  );
}
