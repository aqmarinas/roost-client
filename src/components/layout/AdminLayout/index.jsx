import React, { useState, useEffect } from "react";
import Sidebar from "../../layout/Sidebar";

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        toggleCollapse={toggleCollapse}
      />

      <div
        className={`flex-1 transition-all duration-300 min-w-0 
        ${isCollapsed ? "ml-20" : "ml-64"}
        ${isMobile && !isCollapsed ? "blur-sm pointer-events-none" : ""}
      `}
      >
        <div className="px-2 md:px-6 py-6 lg:p-8 bg-gray-100 min-h-screen">{children}</div>
      </div>
    </div>
  );
}
