// // import React, { useState } from "react";
// import {
//   // FaBars,
//   // FaTimes,
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";
// import "index.css";
// const SidebarSec = () => {
//   const { pathname } = useLocation();

//   const navItems = [
//     { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
//     { path: "/order", icon: FaShoppingCart, label: "Order" },
//     { path: "/users", icon: FaUser, label: "Users" },
//     { path: "/product", icon: FaProductHunt, label: "Product" },
//     { path: "/stock", icon: FaBox, label: "Stock" },
//     { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" }, // Fixed typo
//     { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
//     { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
//     { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
//   ];

//   return (
//     <div>
//       {/* Logo */}
//       <div className="p-4  flex justify-center">
//         <img
//           src={logo}
//           alt="Optima Polyplast Logo"
//           className="w-[13.75rem] h-[8.75rem] " // Converted 55/35 to rem (assuming 16px base)
//           loading="lazy" // Added for performance
//         />
//       </div>
//       <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sticky">
//         <ul className="space-y-4 p-4">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <li
//               key={path}
//               // className={}
//             >
//               <Link
//                 to={path}
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <Icon />
//                 <span>{label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default SidebarSec;
import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaProductHunt,
  FaCalendarCheck,
  FaBullhorn,
  FaShoppingCart,
  FaUserPlus,
  FaBox,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo1.png";
import "./index.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Navigation items array for better maintainability
  const navItems = [
    { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/order", icon: FaShoppingCart, label: "Order" },
    { path: "/users", icon: FaUser, label: "Users" },
    { path: "/product", icon: FaProductHunt, label: "Product" },
    { path: "/stock", icon: FaBox, label: "Stock" },
    { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" }, // Fixed typo
    { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
    { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
    { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
  ];

  // Common classes
  const sidebarClasses = `
    fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10 
    transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:flex lg:flex-col
  `;

  const navItemClasses = (isActive) => `
    hover:bg-gray-700 p-2 rounded-lg 
    ${isActive ? "bg-gray-700" : ""}
  `;

  return (
    <div className="relative h-screen ">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden p-4 text-white bg-gray-800 fixed z-20 top-2 left-2"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Logo */}
        <div className="p-4  flex justify-center">
          <img
            src={logo}
            alt="Optima Polyplast Logo"
            className="w-[13.75rem] h-[8.75rem] " // Converted 55/35 to rem (assuming 16px base)
            loading="lazy" // Added for performance
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sticky">
          <ul className="space-y-4 p-4">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path} className={navItemClasses(pathname === path)}>
                <Link
                  to={path}
                  className="flex items-center space-x-3 text-white"
                >
                  <Icon />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Background Overlay for Mobile */}
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={toggleSidebar}
        />
      )} */}
      {/*lg:hidden*/}
    </div>
  );
};

export default Sidebar;
