"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // For active route detection
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FolderIcon,
  HomeIcon,          // Overview
  UserGroupIcon,      // Manage Users
  ClipboardIcon,  // Users Activity
  BuildingOfficeIcon, // Companies
  MapIcon,            // Navigations
  ChatBubbleLeftIcon, // Feedbacks
  UserPlusIcon,       // Onboard User
  ArrowRightIcon, // Logout
} from "@heroicons/react/24/outline"; // Use outline icons from v2
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Closed by default
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname(); // Get current route

  if (!isAuthenticated) {
    return null; // AuthProvider will redirect to login
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href?: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = href ? pathname === href : false; // Highlight based on current route
    const content = (
      <div
        className={cn(
          "flex items-center w-full",
          isOpen ? "justify-start" : "justify-center"
        )}
      >
        <Icon className="h-5 w-5" />
        {isOpen && <span className="ml-3">{label}</span>}
      </div>
    );

    if (href) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={href}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white" // Highlight active route
                    : "text-white hover:bg-gray-700/50",
                  !isOpen && "justify-center"
                )}
              >
                {content}
              </Link>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={logout} // Attach logout handler here for Logout button
              className={cn(
                "w-full justify-start hover:bg-gray-700/50 hover:text-white",
                isActive ? "bg-indigo-600 text-white" : "text-white",
                !isOpen && "justify-center"
              )}
            >
              {content}
            </Button>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-gray-800 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-bold text-white">VERSUS™ Admin</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700/50 hover:text-white"
        >
          <FolderIcon className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-3 py-2 flex-1">
        {isOpen && <p className="text-xs uppercase text-gray-400 mb-2">Navigation</p>}
        <nav className="space-y-1">
          <NavItem href="/pages/dash" icon={HomeIcon} label="Overview" />
          <NavItem href="/pages/dashboard" icon={UserGroupIcon} label="Manage Users" />
          <NavItem href="/pages/activity" icon={ClipboardIcon} label="Users Activity" />
          <NavItem href="/pages/company" icon={BuildingOfficeIcon} label="Companies" />
          <NavItem href="/pages/users" icon={MapIcon} label="Navigations" />
          <NavItem href="/pages/feedback" icon={ChatBubbleLeftIcon} label="Feedbacks" />
          <NavItem href="/pages/onboard" icon={UserPlusIcon} label="Onboard User" />
        </nav>
      </div>

      <div className="mt-auto px-3 py-4">
        <NavItem icon={ArrowRightIcon} label="Logout" />
      </div>
    </aside>
  );
};

export default Sidebar;