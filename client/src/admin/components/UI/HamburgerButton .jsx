// src/components/HamburgerButton.jsx
import React from "react";
import useWindowSize from "../../store/useWindowSize";

const HamburgerButton = () => {
  const { isOpen, isMobile, setIsOpen } = useWindowSize();
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="group relative w-10 h-10 z-50 focus:outline-none"
      aria-label="Toggle Menu"
    >
      <div className="relative w-8 h-6 flex flex-col justify-between items-center">
        {/* Top bar */}
        <span
          className={`h-1 w-full bg-white rounded transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        {/* Middle bar */}
        <span
          className={`h-1 w-full bg-white rounded transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Bottom bar */}
        <span
          className={`h-1 w-full bg-white rounded transition-transform duration-300 ease-in-out ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </div>
    </button>
  );
};

export default HamburgerButton;
