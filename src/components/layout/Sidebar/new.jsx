import { Link, useLocation, useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import useAuth from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Avatar from "@/assets/avatar.jpg";
import { Button } from "@/components/ui/button";
import { LogOutIcon, CalendarIcon, SettingsIcon, BuildingIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const navigation = [
  { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
  { name: "Rooms", href: "/admin/rooms", icon: BuildingIcon },
  { name: "Facilities", href: "/admin/facilities", icon: SettingsIcon },
];

export default function AdminSidebar() {
  const { auth } = useAuth();
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : null;
  const { state } = useSidebar();

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
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between w-full mb-4">
            {state === "collapsed" ? (
              <SidebarTrigger />
            ) : (
              <>
                <Link to="/admin/bookings">
                  <span className="text-2xl font-bold text-indigo-600">Roost</span>
                </Link>
                <SidebarTrigger />
              </>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navigation.map((item) => {
              const isCurrent = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <a href={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isCurrent}
                      size="default"
                    >
                      <div>
                        <item.icon className={`${isCurrent ? "text-indigo-700" : "text-gray-900"} size-6`} />
                        <span className={`${isCurrent ? "text-indigo-700" : "text-gray-900"} font-medium`}>{item.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          {state === "collapsed" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOutIcon className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  alt="User profile"
                  src={Avatar}
                  className="size-8 rounded-full"
                />
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{decoded?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{decoded?.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* trigger button for mobile */}
    </>
  );
}
