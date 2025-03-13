"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  // Hide sidebar on the index page ("/")
  const showSidebar = pathname !== "/";

  return (
    <>
      {showSidebar ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 bg-gray-800 max-h-screen overflow-auto">
            {children}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-800">{children}</div>
      )}
    </>
  );
};

export default LayoutWrapper;