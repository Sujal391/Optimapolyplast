// import React, { useState } from "react";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaUser,
//   FaBox,
//   FaProductHunt,
//   FaDollarSign,
//   FaBullhorn,
//   FaTruck,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   // State Management for Sidebar and Dropdowns
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState("");

//   const toggleSidebar = () => {
//     setOpenSidebar(!openSidebar);
//   };

//   const toggleDropdown = (name) => {
//     setOpenDropdown(openDropdown === name ? "" : name);
//   };

//   return (
//     <div className="relative h-full">
//       {/* Mobile Toggle Button */}
//       <button
//         className="lg:hidden p-4 text-white bg-gray-800 fixed z-20 top-0 left-0"
//         onClick={toggleSidebar}
//       >
//         {openSidebar ? <FaTimes size={24} /> : <FaBars size={24} />}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed top-0 left-0 h-full bg-gray-800 text-white z-10 transition-transform
//           ${openSidebar ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0 lg:w-64
//         `}
//       >
//         {/* Logo */}
//         <div className="p-4">
//           <img
//             src={logo}
//             alt="Optima Polyplast Logo"
//             className="w-40 h-34 sm:w-48 sm:h-36 md:w-56 md:h-40"
//           />
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto">
//           <ul className="space-y-4 p-4">
//             {/* Dashboard */}
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link to="/dashboard" className="flex items-center space-x-3 text-white">
//                 <FaHome />
//                 <span>Dashboard</span>
//               </Link>
//             </li>

//             {/* User Dropdown */}
//             <li>
//               <div
//                 onClick={() => toggleDropdown("user")}
//                 className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//               >
//                 <div className="flex items-center space-x-3">
//                   <FaUser />
//                   <span>User</span>
//                 </div>
//                 <span>{openDropdown === "user" ? "▲" : "▼"}</span>
//               </div>
//               {openDropdown === "user" && (
//                 <ul className="ml-6 mt-2 space-y-2">
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/users/all" className="block text-white">All Users</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/users/active" className="block text-white">Active Users</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/users/inactive" className="block text-white">Inactive Users</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Stock Dropdown */}
//             <li>
//               <div
//                 onClick={() => toggleDropdown("stock")}
//                 className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//               >
//                 <div className="flex items-center space-x-3">
//                   <FaBox />
//                   <span>Stock</span>
//                 </div>
//                 <span>{openDropdown === "stock" ? "▲" : "▼"}</span>
//               </div>
//               {openDropdown === "stock" && (
//                 <ul className="ml-6 mt-2 space-y-2">
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/stock/product-list" className="block text-white">Product List</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/stock/quantity" className="block text-white">Quantity</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Product Dropdown */}
//             <li>
//               <div
//                 onClick={() => toggleDropdown("product")}
//                 className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//               >
//                 <div className="flex items-center space-x-3">
//                   <FaProductHunt />
//                   <span>Product</span>
//                 </div>
//                 <span>{openDropdown === "product" ? "▲" : "▼"}</span>
//               </div>
//               {openDropdown === "product" && (
//                 <ul className="ml-6 mt-2 space-y-2">
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/product/upload" className="block text-white">Upload New Products</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Offer/Deal Dropdown */}
//             <li>
//               <div
//                 onClick={() => toggleDropdown("offer")}
//                 className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//               >
//                 <div className="flex items-center space-x-3">
//                   <FaDollarSign />
//                   <span>Offer/Deal</span>
//                 </div>
//                 <span>{openDropdown === "offer" ? "▲" : "▼"}</span>
//               </div>
//               {openDropdown === "offer" && (
//                 <ul className="ml-6 mt-2 space-y-2">
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/offer/manage" className="block text-white">Manage Offers</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/offer/deals" className="block text-white">Deals</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Payment Dropdown */}
//             <li>
//               <div
//                 onClick={() => toggleDropdown("payment")}
//                 className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//               >
//                 <div className="flex items-center space-x-3">
//                   <FaDollarSign />
//                   <span>Payment</span>
//                 </div>
//                 <span>{openDropdown === "payment" ? "▲" : "▼"}</span>
//               </div>
//               {openDropdown === "payment" && (
//                 <ul className="ml-6 mt-2 space-y-2">
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/payment/upi" className="block text-white">UPI</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/payment/net-banking" className="block text-white">Net Banking</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/payment/cod" className="block text-white">COD</Link>
//                   </li>
//                   <li className="hover:bg-gray-600 p-2 rounded-lg">
//                     <Link to="/payment/filters" className="block text-white">Filters</Link>
//                   </li>
//                 </ul>
//               )}
//             </li>


//             {/* Other Links */}
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link to="/marketing" className="flex items-center space-x-3 text-white">
//                 <FaBullhorn />
//                 <span>Marketing</span>
//               </Link>
//             </li>
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link to="/dispatch" className="flex items-center space-x-3 text-white">
//                 <FaTruck />
//                 <span>Dispatch</span>
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// import React, { useState } from "react";
// import {
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaUser,
//   FaBox,
//   FaProductHunt,
//   FaDollarSign,
//   FaBullhorn,
//   FaTruck,
//   FaShoppingCart,
//   FaUserPlus,
//   FaCalendarCheck,
//   FaThList

// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState("");

//   const toggleSidebar = () => setOpenSidebar(!openSidebar);
//   const toggleDropdown = (name) =>
//     setOpenDropdown(openDropdown === name ? "" : name);

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
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/admin/dashboard"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaHome />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//             {/* order */}
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/order"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaShoppingCart />
//                 <span>Order</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/users"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaUser />
//                 <span>Users</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/product"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaProductHunt />
//                 <span>Product</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/miscellaneous"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaThList />
//                 <span>Miscellaneous</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/attandance"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaCalendarCheck />
//                 <span>Attandance</span>
//               </Link>
//             </li>

            

            

//             {/* Dropdown Links */}
//             {[
//               {
//                 name: "stock",
//                 icon: <FaBox />,
//                 label: "Stock",
//                 links: [
//                   { to: "/stock/product-list", label: "Product List" },
//                   { to: "/stock/quantity", label: "Quantity" },
//                 ],
//               },
            
//               {
//                 name: "payment",
//                 icon: <FaDollarSign />,
//                 label: "Payment",
//                 links: [
//                   { to: "/payment/upi", label: "UPI" },
//                   { to: "/payment/net-banking", label: "Net Banking" },
//                   { to: "/payment/cod", label: "COD" },
//                   { to: "/payment/filters", label: "Filters" },
//                 ],
//               },
//             ].map(({ name, icon, label, links }) => (
//               <li key={name}>
//                 <div
//                   onClick={() => toggleDropdown(name)}
//                   className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//                   aria-expanded={openDropdown === name}
//                 >
//                   <div className="flex items-center space-x-3">
//                     {icon}
//                     <span>{label}</span>
//                   </div>
//                   <span>{openDropdown === name ? "▲" : "▼"}</span>
//                 </div>
//                 {openDropdown === name && (
//                   <ul className="ml-6 mt-2 space-y-2">
//                     {links.map(({ to, label }) => (
//                       <li
//                         key={to}
//                         className="hover:bg-gray-600 p-2 rounded-lg"
//                       >
//                         <Link to={to} className="block text-white">
//                           {label}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}

//             {/* Static Links */}
//             {/* <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/marketing"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBullhorn />
//                 <span>Marketing</span>
//               </Link>
//             </li> */}

//               <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/marketing"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBullhorn />
//                 <span>Marketing</span>
//               </Link>
//             </li>

//             {/* <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/dispatch"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaTruck />
//                 <span>Dispatch</span>
//               </Link>
//             </li>
//              */}
            
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/createUser"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaUserPlus />
                
             
//                 <span>Create Users</span>
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
// import { Link } from "react-router-dom";
// import logo from "../../assets/logo1.png";

// const Sidebar = () => {
//   const [openSidebar, setOpenSidebar] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState("");

//   const toggleSidebar = () => setOpenSidebar(!openSidebar);
//   const toggleDropdown = (name) =>
//     setOpenDropdown(openDropdown === name ? "" : name);

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
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/admin/dashboard"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaHome />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//             {/* order */}
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/order"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaShoppingCart />
//                 <span>Order</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/users"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaUser />
//                 <span>Users</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/product"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaProductHunt />
//                 <span>Product</span>
//               </Link>
//             </li>
//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/stock"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBox />
//                 <span>Stock</span>
//               </Link>
//             </li>

//             {/* <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/miscellaneous"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaThList />
//                 <span>Miscellaneous</span>
//               </Link>
//             </li> */}

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/attandance"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaCalendarCheck />
//                 <span>Attandance</span>
//               </Link>
//             </li>

//             {/* {[
//               {
//                 name: "payment",
//                 icon: <FaDollarSign />,
//                 label: "Payment",
//                 links: [
//                   { to: "/payment/upi", label: "UPI" },
//                   { to: "/payment/net-banking", label: "Net Banking" },
//                   { to: "/payment/cod", label: "COD" },
//                   { to: "/payment/filters", label: "Filters" },
//                 ],
//               },
//             ].map(({ name, icon, label, links }) => (
//               <li key={name}>
//                 <div
//                   onClick={() => toggleDropdown(name)}
//                   className="flex items-center justify-between hover:bg-gray-700 p-2 rounded-lg cursor-pointer"
//                   aria-expanded={openDropdown === name}
//                 > */}
//                   {/* <div className="flex items-center space-x-3">
//                     {icon}
//                     <span>{label}</span>
//                   </div>
//                   <span>{openDropdown === name ? "▲" : "▼"}</span>
//                 </div>
//                 {openDropdown === name && (
//                   <ul className="ml-6 mt-2 space-y-2">
//                     {links.map(({ to, label }) => (
//                       <li
//                         key={to}
//                         className="hover:bg-gray-600 p-2 rounded-lg"
//                       >
//                         <Link to={to} className="block text-white">
//                           {label}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))} */}

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
//               <Link
//                 to="/marketing"
//                 className="flex items-center space-x-3 text-white"
//               >
//                 <FaBullhorn />
//                 <span>Marketing</span>
//               </Link>
//             </li>

//             <li className="hover:bg-gray-700 p-2 rounded-lg">
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


import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaProductHunt,
  FaDollarSign,
  FaBullhorn,
  FaShoppingCart,
  FaUserPlus,
  FaCalendarCheck,
  FaThList,
  FaBox
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import logo from "../../assets/logo1.png";

const Sidebar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation(); // Get current location

  const toggleSidebar = () => setOpenSidebar(!openSidebar);
  const toggleDropdown = (name) =>
    setOpenDropdown(openDropdown === name ? "" : name);

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden p-4 text-white bg-gray-800 fixed z-20 top-2 left-2"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {openSidebar ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10 transition-transform duration-300
          ${openSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:flex lg:flex-col
        `}
      >
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <img
            src={logo}
            alt="Optima Polyplast Logo"
            className="w-55 h-35"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <ul className="space-y-4 p-4">
            {/* Dashboard */}
            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/admin/dashboard") ? "bg-gray-700" : ""}`}>
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-3 text-white"
              >
                <FaHome />
                <span>Dashboard</span>
              </Link>
            </li>
            {/* Order */}
            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/order") ? "bg-gray-700" : ""}`}>
              <Link
                to="/order"
                className="flex items-center space-x-3 text-white"
              >
                <FaShoppingCart />
                <span>Order</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/users") ? "bg-gray-700" : ""}`}>
              <Link
                to="/users"
                className="flex items-center space-x-3 text-white"
              >
                <FaUser />
                <span>Users</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/product") ? "bg-gray-700" : ""}`}>
              <Link
                to="/product"
                className="flex items-center space-x-3 text-white"
              >
                <FaProductHunt />
                <span>Product</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/stock") ? "bg-gray-700" : ""}`}>
              <Link
                to="/stock"
                className="flex items-center space-x-3 text-white"
              >
                <FaBox />
                <span>Stock</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/attandance") ? "bg-gray-700" : ""}`}>
              <Link
                to="/attandance"
                className="flex items-center space-x-3 text-white"
              >
                <FaCalendarCheck />
                <span>Attandance</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/marketing") ? "bg-gray-700" : ""}`}>
              <Link
                to="/marketing"
                className="flex items-center space-x-3 text-white"
              >
                <FaBullhorn />
                <span>Marketing</span>
              </Link>
            </li>

            <li className={`hover:bg-gray-700 p-2 rounded-lg ${isActive("/createUser") ? "bg-gray-700" : ""}`}>
              <Link
                to="/createUser"
                className="flex items-center space-x-3 text-white"
              >
                <FaUserPlus />
                <span>Create Panels</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Background Overlay for Mobile */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;