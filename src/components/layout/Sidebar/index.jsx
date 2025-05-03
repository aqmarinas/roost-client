import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { CalendarIcon, BuildingOfficeIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Avatar from "@/assets/avatar.jpg";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
  { name: "Rooms", href: "/admin/rooms", icon: BuildingOfficeIcon },
  { name: "Facilities", href: "/admin/facilities", icon: Cog6ToothIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ isCollapsed, isMobile, toggleCollapse }) {
  const { auth } = useAuth();
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : null;

  const location = useLocation();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is expanded */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 blur-sm pointer-events-none bg-opacity-50 z-40"
          onClick={toggleCollapse}
        />
      )}

      <div
        className={`
          fixed z-50 h-screen flex flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 transition-all left-0 duration-300 pt-4 ${isMobile && !isCollapsed ? "w-full" : isCollapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Toggle Button */}
        <div className="flex h-16 shrink-0 items-center justify-between">
          {!isCollapsed && (
            <Link
              to="/admin/bookings"
              className="text-2xl font-bold text-indigo-600"
            >
              Roost
            </Link>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`flex items-center text-gray-500 hover:text-gray-700 focus:outline-none ${isCollapsed && "-mx-2.5"}`}
            onClick={toggleCollapse}
          >
            {isCollapsed ? <Bars3Icon className="size-5" /> : <XMarkIcon className="size-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul
            role="list"
            className="flex flex-1 flex-col gap-y-7"
          >
            <li>
              <ul
                role="list"
                className="-mx-2 space-y-1"
              >
                {navigation.map((item) => {
                  const isCurrent = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          isCurrent ? "bg-gray-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          isCollapsed ? "p-1 justify-center" : "p-2",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                      >
                        <item.icon className={classNames(isCurrent ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600", "size-5 shrink-0")} />
                        {!isCollapsed && (
                          <>
                            <span className="truncate">{item.name}</span>
                            {/* {item.count && <span className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs/5 font-medium text-gray-600 ring-1 ring-inset ring-gray-200">{item.count}</span>} */}
                          </>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Profile Section */}
            {!isCollapsed && (
              <li className="-mx-2 mt-auto mb-6">
                <Menu
                  as="div"
                  className="relative"
                >
                  <MenuButton
                    className="flex items-center gap-x-2 p-2 w-full rounded-md hover:bg-gray-50 hover:cursor-pointer"
                    tabIndex={0}
                  >
                    <img
                      alt="User profile"
                      src={Avatar}
                      className="size-8 rounded-full"
                    />
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{decoded?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{decoded?.role}</p>
                    </div>
                  </MenuButton>
                  <MenuItems className={classNames("absolute z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none", isCollapsed ? "left-full ml-2" : "left-0 bottom-full mb-2")}>
                    <MenuItem>
                      {({ focus }) => (
                        <div
                          onClick={handleLogout}
                          className={classNames(focus ? "bg-gray-100 cursor-pointer" : "", "block px-4 py-2 text-sm text-red-500")}
                        >
                          Log out
                        </div>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
