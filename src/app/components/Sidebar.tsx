// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { 
//     MenuIcon,
//     LogoutIcon,
//     CogIcon,
//     UsersIcon,
//     ClipboardListIcon, 
//   } from '@heroicons/react/outline';
  

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(true);
  
//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const NavItem = ({ 
//     href, 
//     icon: Icon, 
//     label 
//   }: { 
//     href?: string, 
//     icon: React.ElementType, 
//     label: string 
//   }) => {
//     const content = (
//       <div className={cn(
//         "flex items-center w-full",
//         isOpen ? "justify-start" : "justify-center"
//       )}>
//         <Icon className="h-5 w-5" />
//         {isOpen && <span className="ml-3">{label}</span>}
//       </div>
//     );

//     if (href) {
//       return (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Link 
//                 href={href}
//                 className={cn(
//                   "w-full flex items-center px-3 py-2 text-sm text-white hover:bg-gray-700/50 rounded-md transition-colors",
//                   !isOpen && "justify-center"
//                 )}
//               >
//                 {content}
//               </Link>
//             </TooltipTrigger>
//             {!isOpen && (
//               <TooltipContent side="right">
//                 <p>{label}</p>
//               </TooltipContent>
//             )}
//           </Tooltip>
//         </TooltipProvider>
//       );
//     }
    
//     return (
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button 
//               variant="ghost" 
//               className={cn(
//                 "w-full justify-start text-white hover:bg-gray-700/50 hover:text-white",
//                 !isOpen && "justify-center"
//               )}
//             >
//               {content}
//             </Button>
//           </TooltipTrigger>
//           {!isOpen && (
//             <TooltipContent side="right">
//               <p>{label}</p>
//             </TooltipContent>
//           )}
//         </Tooltip>
//       </TooltipProvider>
//     );
//   };

//   return (
//     <aside
//       className={cn(
//         "h-screen bg-gray-800 transition-all duration-300 flex flex-col",
//         isOpen ? "w-64" : "w-16"
//       )}
//     >
//       <div className="p-4 flex items-center justify-between">
//         {isOpen && <h2 className="text-xl font-bold text-white">VERSUS&#8482; Admin</h2>}
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           onClick={toggleSidebar}
//           className="text-white hover:bg-gray-700/50 hover:text-white"
//         >
//           <MenuIcon className="h-6 w-6" />
//         </Button>
//       </div>
      
//       <div className="px-3 py-2">
//         {isOpen && <p className="text-xs uppercase text-gray-400 mb-2"></p>}
//         <nav className="space-y-1">
//           <NavItem href="/pages/dashboard" icon={UsersIcon} label="Manage Users" />
//           <NavItem href="/pages/activity" icon={ClipboardListIcon} label="Users Activity" />
//           <NavItem href="/company" icon={CogIcon} label="Companies" />
//           <NavItem href="/pages/onboard" icon={UsersIcon} label="Onboard User" />
//         </nav>
//       </div>
      
//       <div className="mt-auto px-3 py-4">
//         <NavItem icon={LogoutIcon} label="Logout" />
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MenuIcon,
  LogoutIcon,
  CogIcon,
  UsersIcon,
  ClipboardListIcon,
} from '@heroicons/react/outline';
import { useAuth } from '../context/AuthContext';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('/pages/dashboard'); // Default active item
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null; // The AuthProvider will redirect to the login page
  }


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({
    href,
    icon: Icon,
    label
  }: {
    href?: string,
    icon: React.ElementType,
    label: string
  }) => {
    const content = (
      <div className={cn(
        "flex items-center w-full",
        isOpen ? "justify-start" : "justify-center"
      )}>
        <Icon className="h-5 w-5" />
        {isOpen && <span className="ml-3">{label}</span>}
      </div>
    );

    const isActive = href === activeItem;

    if (href) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={href}
                onClick={() => setActiveItem(href)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive ? "bg-gray-700 text-white" : "text-white hover:bg-gray-700/50",
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
              className={cn(
                "w-full justify-start hover:bg-gray-700/50 hover:text-white",
                isActive ? "bg-gray-700 text-white" : "text-white",
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
        {isOpen && <h2 className="text-xl font-bold text-white">VERSUS&#8482; Admin</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700/50 hover:text-white"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>

      <div className="px-3 py-2">
        {isOpen && <p className="text-xs uppercase text-gray-400 mb-2"></p>}
        <nav className="space-y-1">
          <NavItem href="/pages/dash" icon={UsersIcon} label="Overview" />
          <NavItem href="/pages/dashboard" icon={UsersIcon} label="Manage Users" />
          <NavItem href="/pages/activity" icon={ClipboardListIcon} label="Users Activity" />
          <NavItem href="/pages/company" icon={CogIcon} label="Companies" />
          <NavItem href="/pages/users" icon={CogIcon} label="Navigations" />
          <NavItem href="/pages/feedback" icon={CogIcon} label="Feedbacks" />
          <NavItem href="/pages/onboard" icon={UsersIcon} label="Onboard User" />
        </nav>
      </div>

      <div className="mt-auto px-3 py-4"           onClick={logout}
      >
        <NavItem icon={LogoutIcon} label="Logout" />
      </div>
    </aside>
  );
};

export default Sidebar;
