"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  MenuIcon,              // Toggle sidebar (replacing FolderIcon)
  HomeIcon,             // Overview
  UsersIcon,            // Manage Users (replacing UserGroupIcon)
  ClipboardIcon,        // Users Activity
  OfficeBuildingIcon,   // Companies (replacing BuildingOfficeIcon)
  MapIcon,              // Navigations
  ChatAltIcon,          // Feedbacks (replacing ChatBubbleLeftIcon)
  UserAddIcon,          // Onboard User (replacing UserPlusIcon)
  LogoutIcon,           // Logout (replacing ArrowRightIcon)
} from "@heroicons/react/outline"; // Heroicons v1 import
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Closed by default
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href?: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = href ? pathname === href : false;
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
                  isActive ? "bg-indigo-600 text-white" : "text-white hover:bg-gray-700/50",
                  !isOpen && "justify-center"
                )}
              >
                {content}
              </Link>
            </TooltipTrigger>
            {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
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
              onClick={logout}
              className={cn(
                "w-full justify-start hover:bg-gray-700/50 hover:text-white",
                "text-white",
                !isOpen && "justify-center"
              )}
            >
              {content}
            </Button>
          </TooltipTrigger>
          {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
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
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-3 py-2 flex-1">
        {isOpen && <p className="text-xs uppercase text-gray-400 mb-2">Navigation</p>}
        <nav className="space-y-1">
          <NavItem href="/pages/dash" icon={HomeIcon} label="Overview" />
          <NavItem href="/pages/dashboard" icon={UsersIcon} label="Manage Users" />
          <NavItem href="/pages/activity" icon={ClipboardIcon} label="Users Activity" />
          <NavItem href="/pages/company" icon={OfficeBuildingIcon} label="Companies" />
          <NavItem href="/pages/users" icon={MapIcon} label="Navigations" />
          <NavItem href="/pages/feedback" icon={ChatAltIcon} label="Feedbacks" />
          <NavItem href="/pages/onboard" icon={UserAddIcon} label="Onboard User" />
        </nav>
      </div>

      <div className="mt-auto px-3 py-4">
        <NavItem icon={LogoutIcon} label="Logout" />
      </div>
    </aside>
  );
};

export default Sidebar;