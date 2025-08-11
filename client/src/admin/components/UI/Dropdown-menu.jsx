// components/UI/DropdownMenu.jsx
import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { LogOut, User, Mail, Settings } from "lucide-react";

export const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger = ({ children }) => {
  return <div className="cursor-pointer">{children}</div>;
};

export const DropdownMenuContent = ({ children, align = "end" }) => {
  const alignmentClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  };

  return (
    <div
      className={`absolute mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${alignmentClasses[align]}`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({
  children,
  icon: Icon,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="mr-3 h-4 w-4" />}
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children }) => {
  return (
    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = () => {
  return <hr className="border-gray-200 dark:border-gray-700 my-1" />;
};

export const ProfileDropdown = ({ profileData, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div onClick={() => setIsOpen(!isOpen)}>
          <Avatar
            src={profileData?.imageUrl}
            className="h-8 w-8 border-2 border-blue-500 cursor-pointer"
          >
            {profileData?.name?.charAt(0) || "A"}
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profileData?.name || "Admin"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {profileData?.email || "admin@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={User}>Profile</DropdownMenuItem>
          <DropdownMenuItem icon={Mail}>Inbox</DropdownMenuItem>
          <DropdownMenuItem icon={Settings}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            icon={LogOut}
            className="text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};
