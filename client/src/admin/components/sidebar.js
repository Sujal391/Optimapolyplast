// import React, { useState } from "react";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaDollarSign,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaCalendarCheck,
//   FaThList,
//   FaBox
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom"; // Added useLocation
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState("");
//   const location = useLocation(); // Get current location

//   const toggleSidebar = () => setOpenSidebar(!openSidebar);
//   const toggleDropdown = (name) =>
//     setOpenDropdown(openDropdown === name ? "" : name);

//   // Function to check if a link is active
//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="relative h-screen">
//       {/* Mobile Toggle Button */}
//       <button
//         className="lg:hidden p-4 text-white bg-gray-800 fixed z-20 top-2 left-2"
//         onClick={toggleSidebar}
//         aria-label="Toggle Sidebar"
//       >
//         {openSidebar ? <FaTimes size={24} /> : <FaBars size={24} />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10 transition-transform duration-300
//           ${openSidebar ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0 lg:flex lg:flex-col
//         `}
//       >
//         {/* Logo */}
//         <div className="p-4 flex justify-center">
//           <img
//             src={logo}
//             alt="Optima Polyplast Logo"
//             className="w-55 h-35"
//           />
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
//           <ul className="space-y-4 p-4">
//             {/* Dashboard */}
//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/admin/dashboard") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/admin/dashboard"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaHome />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//             {/* Order */}
//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/order") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/order"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaShoppingCart />
//                 <span>Order</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/users") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/users"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaUser />
//                 <span>Users</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/product") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/product"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaProductHunt />
//                 <span>Product</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/stock") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/stock"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBox />
//                 <span>Stock</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/attandance") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/attandance"
//                 className="flex items-center space-x-3 text-white"
//               >
// {/* <FaCalendarCheck /> */}
//                 <FaBox />
//                 <span>Attandance</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/marketing") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/marketing"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBullhorn />
//                 <span>Marketing</span>
//               </Link>
//             </li>

//             <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/createUser") ? "bg-gray-700" : ""}`}>
//               <Link
//                 to="/createUser"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaUserPlus />
//                 <span>Create Panels</span>
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Background Overlay for Mobile */}
//       {openSidebar && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from "react";
// import {
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//       if (window.innerWidth >= 1024) setIsOpen(false);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (isMobile) {
//       document.body.style.overflow = isOpen ? "hidden" : "auto";
//     }
//   }, [isOpen, isMobile]);

//   const navItems = [
//     { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
//     { path: "/order", icon: FaShoppingCart, label: "Order" },
//     { path: "/users", icon: FaUser, label: "Users" },
//     { path: "/product", icon: FaProductHunt, label: "Product" },
//     { path: "/stock", icon: FaBox, label: "Stock" },
//     { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" },
//     { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
//     { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
//     { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
//   ];

//   const sidebarClasses = `
//     fixed top-0 left-0 h-full w-64 bg-[#0c4e66] text-white z-40
//     transform transition-transform duration-300
//     ${
//       isMobile
//         ? isOpen
//           ? "translate-x-0 top-0 left-0 w-full -translate-y-full → translate-y-0"
//           : "-translate-x-full"
//         : "translate-x-0"
//     }
//   `;

//   const navItemClasses = (isActive) => `
//     p-2 rounded-lg flex items-center space-x-3
//     ${isActive ? "bg-[#0F828C] scale-[1.03]" : "hover:bg-[#0F828C]"}
//     transition-all duration-300
//   `;

//   return (
//     <div className="relative">
//       {/* Mobile Toggle Button */}
//       {isMobile && (
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="lg:hidden absolute top-4 left-4 z-50 bg-[#0c4e66] p-2 rounded-md text-white"
//         >
//           {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//         </button>
//       )}

//       {/* Sidebar */}
//       <div className={sidebarClasses}>
//         <div className="p-4 flex justify-center">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-[10.75rem] h-[6.75rem]"
//             loading="lazy"
//           />
//         </div>

//         <nav className="flex-1 overflow-y-auto p-4 space-y-4">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <Link
//               key={path}
//               to={path}
//               className={navItemClasses(pathname === path)}
//               onClick={() => isMobile && setIsOpen(false)}
//             >
//               <Icon />
//               <span>{label}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Overlay */}
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import useWindowSize from "../store/useWindowSize";

// const Sidebar = () => {
//   const { isMobile } = useWindowSize();
//   const location = useLocation();

//   const menuItems = [
//     { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
//     { path: "/order", label: "Order", icon: "🛒" },
//     { path: "/users", label: "Users", icon: "👥" },
//     { path: "/product", label: "Product", icon: "📦" },
//     { path: "/stock", label: "Stock", icon: "📊" },
//     { path: "/attandance", label: "Attendance", icon: "📅" },
//     { path: "/marketing", label: "Marketing", icon: "📢" },
//     { path: "/createUser", label: "Create Panels", icon: "➕" },
//     { path: "/upload-banner", label: "Upload Banner", icon: "🖼️" },
//   ];

//   return (
//     <div
//       className={`bg-slate-800 text-white h-screen fixed left-0 top-0 z-50 transition-transform duration-300 `}
//       style={{
//         width: "256px",
//         height: "100vh",
//         position: "fixed",
//         left: 0,
//         top: 0,
//         // zIndex: 40,
//         transform: isMobile ? "translateX(-100%)" : "translateX(0)",
//       }}
//     >
//       {/* Logo Section */}
//       <div className="p-4 border-b border-slate-700">
//         <div className="bg-white p-3 rounded-lg">
//           <div className="text-center">
//             <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
//               <span className="text-white font-bold">O</span>
//             </div>
//             <div className="text-slate-800 font-bold text-sm">OPTIMA</div>
//             <div className="text-slate-500 text-xs">P O L Y P L A S T</div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="flex-1 p-4">
//         <ul className="space-y-2">
//           {menuItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 to={item.path}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   location.pathname === item.path
//                     ? "bg-slate-700 text-white"
//                     : "text-slate-300 hover:bg-slate-700 hover:text-white"
//                 }`}
//               >
//                 <span className="mr-3 text-lg">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

//

//this is default code
import React from "react";
import {
  FaHome,
  FaUser,
  FaProductHunt,
  FaCalendarCheck,
  FaBullhorn,
  FaShoppingCart,
  FaUserPlus,
  FaBox,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo1.png";
import useWindowSize from "../store/useWindowSize";

const Sidebar = () => {
  const { isOpen, isMobile, setIsOpen } = useWindowSize();
  const { pathname } = useLocation();

  const navItems = [
    { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
    { path: "/order", icon: FaShoppingCart, label: "Order" },
    { path: "/users", icon: FaUser, label: "Users" },
    { path: "/product", icon: FaProductHunt, label: "Product" },
    { path: "/stock", icon: FaBox, label: "Stock" },
    { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" },
    { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
    { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
    { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
  ];

  // Sidebar styling using Tailwind
  const sidebarClasses = `
    bg-[#17313E] text-white z-40 transition-transform duration-300
    ${
      isMobile
        ? `fixed top-0 left-0 w-full h-screen ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`
        : "relative w-64 h-screen"
    }
  `;

  const navItemClasses = (isActive) =>
    `p-2 rounded-lg flex items-center text-white space-x-3 no-underline transition-all duration-300 ${
      isActive ? "bg-[#415E72]" : "hover:bg-[#0F828C]"
    }`;

  return (
    <div
      className={`bg-gray-200 transition-transform duration-300 z-30`}
      style={{ minHeight: '100vh' }}
    >
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden fixed top-20 right-4 w-5 h-5 z-50 bg-[#0c4e66] p-3 rounded-md text-white"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <FaTimes size={30} />
          ) : (
            <FaBars size={30} className="absolute top-0 right-0" />
          )}
        </button>
      )}

      {/* Sidebar */}
  <div className={sidebarClasses} style={{ height: '100vh' }}>
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-[10.75rem] h-[6.75rem]"
            loading="lazy"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1  p-4 space-y-2 max-h-[calc(100vh-8rem)]">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={navItemClasses(pathname === path)}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Background overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;

//react pro sidebar using created but mistake available
// import React from "react";
// import {
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { SidebarContent, Menu, MenuItem } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";

// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";
// import useWindowSize from "../store/useWindowSize";

// const CustomSidebar = () => {
//   const { isOpen, isMobile, setIsOpen } = useWindowSize();
//   const { pathname } = useLocation();

//   const navItems = [
//     { path: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
//     { path: "/order", icon: <FaShoppingCart />, label: "Order" },
//     { path: "/users", icon: <FaUser />, label: "Users" },
//     { path: "/product", icon: <FaProductHunt />, label: "Product" },
//     { path: "/stock", icon: <FaBox />, label: "Stock" },
//     { path: "/attandance", icon: <FaCalendarCheck />, label: "Attendance" },
//     { path: "/marketing", icon: <FaBullhorn />, label: "Marketing" },
//     { path: "/createUser", icon: <FaUserPlus />, label: "Create Panels" },
//     { path: "/upload-banner", icon: <FaUserPlus />, label: "Upload Banner" },
//   ];

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <SidebarContent
//         collapsed={!isOpen && isMobile}
//         breakPoint="lg"
//         className="!bg-[#17313E] text-white h-full lg:relative fixed z-50"
//         onBackdropClick={() => setIsOpen(false)}
//         toggled={isMobile && isOpen}
//       >
//         <div className="flex justify-center items-center p-4">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-[10.75rem] h-[6.75rem]"
//             loading="lazy"
//           />
//         </div>
//         <Menu className="px-2">
//           {navItems.map(({ path, icon, label }) => (
//             <MenuItem
//               key={path}
//               icon={icon}
//               component={<Link to={path} />}
//               className={`rounded-lg py-2 px-4 mb-2 text-sm no-underline transition-all duration-300 ${
//                 pathname === path ? "bg-[#415E72]" : "hover:bg-[#0F828C]"
//               }`}
//               onClick={() => isMobile && setIsOpen(false)}
//             >
//               {label}
//             </MenuItem>
//           ))}
//         </Menu>
//       </SidebarContent>

//       {/* Mobile Toggle Button */}
//       {isMobile && (
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="lg:hidden fixed top-4 left-4 z-50 bg-[#0c4e66] p-2 rounded-md text-white"
//         >
//           {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
//         </button>
//       )}

//       {/* Main content */}
//     </div>
//   );
// };

// export default CustomSidebar;

//real code
// import React, { useEffect, useState } from "react";
// import {
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";
// import useWindowSize from "../store/useWindowSize";

// const Sidebar = () => {
//   // const [isOpen, setIsOpen] = useState(false);
//   const { isOpen, isMobile, setIsOpen } = useWindowSize();
//   // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
//   const { pathname } = useLocation();

//   //
//   const navItems = [
//     { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
//     { path: "/order", icon: FaShoppingCart, label: "Order" },
//     { path: "/users", icon: FaUser, label: "Users" },
//     { path: "/product", icon: FaProductHunt, label: "Product" },
//     { path: "/stock", icon: FaBox, label: "Stock" },
//     { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" },
//     { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
//     { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
//     { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
//   ];

//   // const sidebarClasses = `
//   //  fixed top-0 left-0 h-full
//   //   bg-[#17313E] text-white z-40 transition-transform duration-300
//   //   ${isMobile ? "translate-y-0" : "-translate-y-full"}

//   //   lg:translate-x-0 lg:flex lg:flex-col
//   // `;

//   // const sidebarClasses = `
//   //   fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10
//   //   transition-transform duration-300
//   //   ${isOpen ? "translate-x-0" : "-translate-x-full"}
//   //   lg:translate-x-0 lg:flex lg:flex-col
//   // `;
//   const sidebarClasses = `
//   bg-[#17313E] text-white z-[90]
//   ${
//     isMobile
//       ? `fixed top-0 left-0 w-64 h-full transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out`
//       : "relative w-64 h-full flex-shrink-0"
//   }
//   shadow-xl
//   overflow-y-auto
// `;

//   const navItemClasses = (isActive) =>
//     `p-2 rounded-lg flex items-center text-white space-x-3 active:translate-110 no-underline ${
//       isActive ? "bg-[#415E72]" : "hover:bg-[#0F828C]"
//     } transition-all duration-300`;

//   return (
//     <div className="relative">

//       {/* Sidebar */}
//       <div className={sidebarClasses}>
//         {/* Logo */}
//         <div className="p-4 flex justify-center">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-[10.75rem] h-[6.75rem]"
//             loading="lazy"
//           />
//         </div>

//         {/* Nav */}
//         <nav className="flex-1  overflow-y-hidden p-4 space-y-4 max-h-[calc(100vh-8rem)]">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <Link
//               key={path}
//               to={path}
//               className={navItemClasses(pathname === path)}
//               onClick={() => isMobile && setIsOpen(false)}
//             >
//               <Icon />
//               <span>{label}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Dim background when the sheet is open on mobile */}
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;
// this is icon code
// {isMobile && (
//         <button
//           onClick={() => setIsOpen((prev) => !prev)}
//           className=" overflow-x-hidden absolute  right-4 z-50 bg-[#0c4e66] p-2 rounded-md text-white"
//           aria-label="Toggle sidebar"
//         >
//           {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
//         </button>
//       )}

// import React, { useEffect, useState } from "react";
// import {
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const navItems = [
//     { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
//     { path: "/order", icon: FaShoppingCart, label: "Order" },
//     { path: "/users", icon: FaUser, label: "Users" },
//     { path: "/product", icon: FaProductHunt, label: "Product" },
//     { path: "/stock", icon: FaBox, label: "Stock" },
//     { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" },
//     { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
//     { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
//     { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
//   ];

//   const sidebarClasses = `
//     fixed top-0 left-0 h-full w-64 bg-[#0c4e66] text-white z-40
//     transform transition-transform duration-300
//     ${
//       isMobile
//         ? isOpen
//           ? "translate-x-0"
//           : "-translate-x-full"
//         : "translate-x-0"
//     }
//   `;

//   const navItemClasses = (isActive) => `
//     p-2 rounded-lg flex items-center space-x-3
//     ${isActive ? "bg-[#0F828C] scale-[1.03]" : "hover:bg-[#0F828C]"}
//     transition-all duration-300
//   `;

//   return (
//     <div className="relative">
//       {isMobile && (
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="absolute top-4 left-4 z-50 bg-[#0c4e66] p-2 rounded-md text-white"
//         >
//           {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//         </button>
//       )}

//       <div className={sidebarClasses}>
//         <div className="p-4 flex justify-center">
//           <img
//             src={logo}
//             alt="Logo"
//             className="w-[10.75rem] h-[6.75rem]"
//             loading="lazy"
//           />
//         </div>

//         <nav className="flex-1 overflow-y-auto p-4 space-y-4">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <Link
//               key={path}
//               to={path}
//               className={navItemClasses(pathname === path)}
//               onClick={() => isMobile && setIsOpen(false)}
//             >
//               <Icon />
//               <span>{label}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Background overlay for mobile */}
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from "react";
// import {
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// // import './index.css';

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   // const [windowWidth, setWindoWidth] = useState(window.innerWidth);
//   const { pathname } = useLocation();

//   // useEffect(() => {
//   //   const handleResize = () => setWindoWidth(window.innerWidth);
//   //   window.addEventListener("resize", handleResize);
//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);

//   // const toggleSidebar = () => setIsOpen(prev => !prev);

//   // Navigation items array for better maintainability
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

//   // Common classes
//   const sidebarClasses = `
//     fixed top-0 left-0 h-full max-w-30 sm:max-w-340px
//     bg-[#0c4e66] text-white z-10
//     transition-transform duration-300

//     lg:translate-x-0 lg:flex lg:flex-col
//   `;
//   const isDesktop = window.innerWidth > 1024;
//   const whenOnOverClasses =
//     "bg-[#0F828C] transition-transform duration-[2000ms] delay-[1000ms] scale-[1.3] right-10  ";

//   const navItemClasses = (isActive) => `
//       p-2 rounded-lg
//     ${isActive ? whenOnOverClasses : ""}
//   `;

//   // const screenSizeClasses = () =>{

//   // }

//   return (
//     <div className="relative h-auto md:(min-width:768px) sm:(min-width:480px) md:p2 md:text-base sm-p1 sm-text-sm sm:justify-center sm:align-middle ">
//       {/* Mobile Toggle Button */}

//       {isDesktop ? (
//         <navItems size={24} />
//       ) : (
//         <FaBars size={24} />
//       )}

//       {/* // <navItems size={24}>/</navItems> */}
//       {/* Sidebar */}
//       <div className={sidebarClasses}>
//         {/* Logo */}
//         <div className="p-4  flex justify-center">
//           <img
//             src={logo}
//             alt="Optima Polyplast Logo"
//             className="w-[10.75rem] h-[6.75rem] " // Converted 55/35 to rem (assuming 16px base)
//             loading="lazy" // Added for performance
//           />
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sticky">
//           <ul className="space-y-4 p-4 ">
//             {navItems.map(({ path, icon: Icon, label }) => (
//               <li key={path} className={navItemClasses(pathname === path)}>
//                 <Link
//                   to={path}
//                   className="flex items-center space-x-3 no-underline text-white"
//                 >
//                   <Icon />
//                   <span>{label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Background Overlay for Mobile */}

//       {/* <div className={sidebarClasses}>
//           {/* Sidebar content like logo + navItems */}
//       {/* </div> */}

//       {/* /*lg:hidden */}
//     </div>
//   );
// };

// export default Sidebar;

//now editing

// import React, { useEffect, useState } from "react";
// import {
//   FaHome,
//   FaBars,
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

// // import './index.css';

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const { pathname } = useLocation();

//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // useEffect(() => {
//   //   const handleResize = () => setWindoWWidth(window.innerWidth);
//   //   window.addEventListener("resize", handleResize);
//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);

//   // const toggleSidebar = () => setIsOpen((prev) => !prev);

//   // Navigation items array for better maintainability
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

//   // Common classes
//   const sidebarClasses = `
//     fixed top-0 left-0 h-full max-w-30 sm:max-w-340px
//     bg-[#0c4e66] text-white z-10
//     transition-transform duration-300

//     lg:translate-x-0 lg:flex lg:flex-col
//   `;

//   const whenOnOverClasses =
//     "bg-[#0F828C] transition-transform duration-[2000ms] delay-[1000ms] scale-[1.3] right-10  ";

//   const navItemClasses = (isActive) => `
//       p-2 rounded-lg
//     ${isActive ? whenOnOverClasses : ""}
//   `;
//   const isDesktop = windowWidth > 1300;
//   // const screenSizeClasses = () =>{

//   // }

//   return (
//     <div className="relative h-auto md:(min-width:768px) sm:(min-width:480px) md:p2 md:text-base sm-p1 sm-text-sm sm:justify-center sm:align-middle ">
//       {/* Mobile Toggle Button */}
//       {isDesktop ? (
//         <navItems size={24} />
//       ) : (
//         <div className="flex justify-end p-4">
//           <FaBars
//             size={20}
//             className="cursor-pointer text-white"
//             onClick={() => setIsOpen(true)}
//           />
//         </div>
//       )}
//       {/* {(!isDesktop && (
//        <div className="flex justify-end p-4">
//           <FaBars
//             size={20}
//             className="cursor-pointer text-white"
//             onClick={() => setIsOpen(true)}
//           />
//         </div>
//       )) ||
//         (isDesktop && <navItems size={24} />)} */}
//       {/* <navItems size={24} /> */}

//       {/* // <navItems size={24}>/</navItems> */}
//       {/* Sidebar */}
//       <div className={sidebarClasses}>
//         {/* Logo */}
//         <div className="p-4  flex justify-center">
//           <img
//             src={logo}
//             alt="Optima Polyplast Logo"
//             className="w-[10.75rem] h-[6.75rem] " // Converted 55/35 to rem (assuming 16px base)
//             loading="lazy" // Added for performance
//           />
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sticky">
//           <ul className="space-y-4 p-4 ">
//             {navItems.map(({ path, icon: Icon, label }) => (
//               <li key={path} className={navItemClasses(pathname === path)}>
//                 <Link
//                   to={path}
//                   className="flex items-center space-x-3 no-underline text-white"
//                 >
//                   <Icon />
//                   <span>{label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Background Overlay for Mobile */}

//       {/* <div className={sidebarClasses}>
//           {/* Sidebar content like logo + navItems */}
//       {/* </div> */}

//       {/* /*lg:hidden */}
//     </div>
//   );
// };

// export default Sidebar;

// import React, { useEffect, useState } from "react";
// import {
//   FaBars,
//   FaHome,
//   FaUser,
//   FaProductHunt,
//   FaCalendarCheck,
//   FaBullhorn,
//   FaShoppingCart,
//   FaUserPlus,
//   FaBox,
//   FaTimes,
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     const handleResize = () => setWindowWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const navItems = [
//     { path: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
//     { path: "/order", icon: FaShoppingCart, label: "Order" },
//     { path: "/users", icon: FaUser, label: "Users" },
//     { path: "/product", icon: FaProductHunt, label: "Product" },
//     { path: "/stock", icon: FaBox, label: "Stock" },
//     { path: "/attandance", icon: FaCalendarCheck, label: "Attendance" },
//     { path: "/marketing", icon: FaBullhorn, label: "Marketing" },
//     { path: "/createUser", icon: FaUserPlus, label: "Create Panels" },
//     { path: "/upload-banner", icon: FaUserPlus, label: "Upload Banner" },
//   ];

//   const sidebarClasses = `
//     fixed top-0 left-0 h-full w-[260px]
//     bg-[#0c4e66] text-white z-50
//     transition-transform duration-300
//     ${windowWidth > 1300 || isOpen ? "translate-x-0" : "-translate-x-full"}
//   `;

//   const navItemClasses = (isActive) => `
//     p-2 rounded-lg transition duration-200
//     ${isActive ? "bg-[#0F828C] scale-105" : ""}
//   `;

//   return (
//     <>
//       {/* Toggle button only for mobile */}
//       {/* {isDesktop &&  */}
//       {/* // <navItems />,// onClick={() => setIsOpen(true)} */}
//       {/* // } */}
//       {/* Sidebar */}
//       {/* <div className={sidebarClasses}>
//         {/* Close Button on Mobile */}
//       {!isDesktop && (
//           <div className="flex justify-end p-4">
//             <FaBars
//               size={20}
//               className="cursor-pointer text-white"
//               onClick={() => setIsOpen(true)}
//             />
//           </div>
//         )}
//       {/* Logo */}
//       <div className="p-4 flex justify-center">
//         <img
//           src={logo}
//           alt="Logo"
//           className="w-[10.75rem] h-[6.75rem]"
//           loading="lazy"
//         />
//       </div>
//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
//         <ul className="space-y-4 p-4">
//           {navItems.map(({ path, icon: Icon, label }) => (
//             <li key={path} className={navItemClasses(pathname === path)}>
//               <Link
//                 to={path}
//                 className="flex items-center space-x-3 no-underline text-white"
//                 onClick={() => !isDesktop && setIsOpen(false)}
//               >
//                 <Icon />
//                 <span>{label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//       {/* </div> */}
//       {/* Dark overlay only for mobile */}
//       {isOpen && !isDesktop && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;

// import React, { useState } from "react";
// import {
//   FaBars,
//   FaTimes,
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
// // import "./index.css";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { pathname } = useLocation();

//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   // Navigation items array for better maintainability
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

//   // Common classes
//   const sidebarClasses = `
//     fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10
//     transition-transform duration-300
//     ${isOpen ? "translate-x-0" : "-translate-x-full"}
//     translate-x-0 flex flex-col
//   `;

//   const navItemClasses = (isActive) => `
//     hover:bg-gray-700 p-2 rounded-lg
//     ${isActive ? "bg-gray-700" : ""}
//   `;

//   return (
//     <div className="relative h-screen ">
//       {/* Mobile Toggle Button */}
//       {/* <button */}
//       {/* // className="lg:hidden p-4 text-white bg-gray-800 fixed z-20 top-2 left-2" */}
//       {/* // onClick={toggleSidebar} */}
//       {/* // aria-label="Toggle Sidebar" */}
//       {/* // > */}

//       {/* {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />} */}
//       {/* </button> */}

//       {/* Sidebar */}
//       <div className={sidebarClasses}>
//         {/* Logo */}
//         <div className="p-4  flex justify-center">
//           <img
//             src={logo}
//             alt="Optima Polyplast Logo"
//             className="w-[13.75rem] h-[8.75rem] " // Converted 55/35 to rem (assuming 16px base)
//             loading="lazy" // Added for performance
//           />
//           <navItems size={24} />
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 sticky">
//           <ul className="space-y-4 p-4">
//             {navItems.map(({ path, icon: Icon, label }) => (
//               <li key={path} className={navItemClasses(pathname === path)}>
//                 <Link
//                   to={path}
//                   className="flex items-center space-x-3 text-white"
//                 >
//                   <Icon />
//                   <span>{label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       {/* Background Overlay for Mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//       {/*lg:hidden*/}
//     </div>
//   );
// };

// export default Sidebar;
