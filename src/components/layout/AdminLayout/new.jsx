import AdminSidebar from "@/components/layout/Sidebar/new";
import { Toaster } from "react-hot-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width-icon": "64px",
      }}
    >
      <AdminSidebar />
      <div className="px-2 md:px-6 py-6 lg:p-8 bg-gray-100 min-h-screen w-screen">
        <SidebarTrigger />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{ className: "text-sm" }}
        />
      </div>
    </SidebarProvider>
  );
}
