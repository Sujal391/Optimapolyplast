// components/UI/Sheet.jsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@mui/material";

export const Sheet = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const SheetTrigger = ({ children }) => {
  return <div>{children}</div>;
};

export const SheetContent = ({ side = "left", children }) => {
  const sideClasses = {
    left: "left-0",
    right: "right-0",
    top: "top-0",
    bottom: "bottom-0",
  };

  return (
    <div
      className={`fixed inset-y-0 ${sideClasses[side]} z-50 w-72 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300`}
    >
      {children}
    </div>
  );
};

export const SheetHeader = ({ children }) => {
  return <div className="border-b p-4">{children}</div>;
};

export const SheetTitle = ({ children }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};

export const MobileSidebarSheet = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="outlined"
          size="small"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      {isOpen && (
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="p-4">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};
