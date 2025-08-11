// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import LoadingSpinner from "./LoadingSpinner";
// import {
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
// } from "@headlessui/react";

// const Users = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [popupMessage, setPopupMessage] = useState(null);
//   const [popupType, setPopupType] = useState("");

//   const toggleHeaderDropdown = () => setHeaderDropdownOpen((prev) => !prev);

//   // const api = axios.create({
//   //   baseURL: "https://rewa-project.onrender.com/api",
//   // });

//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API,
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ")
//           ? token
//           : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get("/admin/users");
//         setUsers(response.data.users);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         setError(
//           error.response?.data?.message ||
//             "Failed to load users. Please try again later."
//         );
//       }
//     };
//     fetchUsers();
//   }, []);

//   const getStatusClass = (isActive) =>
//     isActive ? "text-green-500" : "text-red-500";

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" ||
//       (user.isActive ? "Active" : "Inactive") === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusToggle = async (userCode, currentStatus) => {
//     try {
//       if (!userCode) throw new Error("Invalid User ID.");

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.userCode === userCode ? { ...user, isBeingToggled: true } : user
//         )
//       );

//       const response = await api.patch(
//         `/admin/users/${userCode}/toggle-status`
//       );

//       if (response.status === 200) {
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.userCode === userCode
//               ? {
//                   ...user,
//                   isActive: !currentStatus,
//                   isBeingToggled: false,
//                 }
//               : user
//           )
//         );
//         setPopupType("success");
//         setPopupMessage(
//           currentStatus
//             ? "User Deactivated Successfully!"
//             : "User Activated Successfully!"
//         );
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error toggling user status:", error);

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user._userCode === userCode
//             ? { ...user, isBeingToggled: false }
//             : user
//         )
//       );

//       setPopupType("error");
//       setPopupMessage("Failed to update status. Please try again later.");
//     } finally {
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   return (
//     <div className="flex min-h-screen sm:flex-wrap sm:flex-col  bg-blue-50 md:(min-width:768px) sm:(min-width:640px) md:p2 md:text-base sm-p1 sm-text-sm ">
//       <Sidebar isOpen={isSidebarOpen} />
//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         } p-4`}
//       >
//         <div className="max-w-2xl flex-wrap mx-auto  bg-white shadow-lg rounded-lg p-4">
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}
//           {loading ? (
//             <div className="text-center text-xl text-blue-500">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             <>
//               <div className="flex justify-between items-center bg-gradient-to-r from-[#3b5779] to-[#273241] text-white p-5 rounded-lg shadow-md mb-6">
//                 <h1 className="text-2xl font-bold">Total Users</h1>
//                 <div className="flex space-x-4 ">
//                   <select
//                     className="px-4 py-2 bg-white text-blue-700 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     value={filterStatus}
//                   >
//                     <option value="All">All Status</option>
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full  table-auto border-collapse border border-gray-200">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="p-2 border border-gray-300 text-left">
//                         User Code
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Name
//                       </th>
//                       <th className="p-1 border border-gray-300 text-left">
//                         Email
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Phone
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Firm Name
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Status
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Created At
//                       </th>
//                       <th className="p-2 border border-gray-300 text-left">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {" "}
//                     {filteredUsers.map((user) => (
//                       <tr key={user._id} className="hover:bg-gray-50">
//                         <td className="p-2 border border-gray-300">
//                           {user.userCode}
//                         </td>
//                         <td className="p-2 border border-gray-300">
//                           {user.name}
//                         </td>
//                         <td className="p-2 border border-gray-300">
//                           {user.email}
//                         </td>
//                         <td className="p-2 border border-gray-300">
//                           {user.phoneNumber}
//                         </td>
//                         <td className="p-2 border border-gray-300">
//                           {user.firmName}
//                         </td>
//                         <td
//                           className={`p-2 border border-gray-300 ${getStatusClass(
//                             user.isActive
//                           )}`}
//                         >
//                           {user.isActive ? "Active" : "Inactive"}
//                         </td>
//                         <td className="p-4 border border-gray-300">
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="p-4 border border-gray-300">
//                           <button
//                             className={`px-4 py-2 rounded ${
//                               user.isBeingToggled || !user.isActive
//                                 ? "bg-green-500 text-white"
//                                 : "bg-red-500 text-white"
//                             }`}
//                             onClick={() =>
//                               handleStatusToggle(user.userCode, user.isActive)
//                             }
//                             disabled={user.isBeingToggled}
//                           >
//                             {user.isActive ? "Deactivate" : "Activate"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {popupMessage && (
//         <div
//           className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${
//             popupType === "success"
//               ? "from-green-400 to-red-600"
//               : "from-green-400 to-red-600"
//           } text-white p-5 rounded-lg shadow-lg z-50 transition-transform duration-300 transform scale-105`}
//           style={{ width: "300px" }}
//         >
//           <div className="flex justify-between items-center">
//             <p>{popupMessage}</p>
//             <button
//               className="text-white font-bold ml-2 cursor-pointer"
//               onClick={() => setPopupMessage(null)}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import LoadingSpinner from "./LoadingSpinner";

// const Users = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [popupMessage, setPopupMessage] = useState(null);
//   const [popupType, setPopupType] = useState("");

//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API,
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ")
//           ? token
//           : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get("/admin/users");
//         setUsers(response.data.users);
//       } catch (err) {
//         setError("Failed to fetch users.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" ||
//       (user.isActive ? "Active" : "Inactive") === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusToggle = async (userCode, currentStatus) => {
//     try {
//       if (!userCode) throw new Error("Invalid User ID.");

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.userCode === userCode ? { ...user, isBeingToggled: true } : user
//         )
//       );

//       const response = await api.patch(
//         `/admin/users/${userCode}/toggle-status`
//       );

//       if (response.status === 200) {
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.userCode === userCode
//               ? {
//                   ...user,
//                   isActive: !currentStatus,
//                   isBeingToggled: false,
//                 }
//               : user
//           )
//         );
//         setPopupType("success");
//         setPopupMessage(
//           currentStatus ? "User Deactivated!" : "User Activated!"
//         );
//       }
//     } catch (error) {
//       setPopupType("error");
//       setPopupMessage("Status update failed.");
//     } finally {
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} className="hidden md:block w-60" />

//       {/* Main content */}
//       <div className={`flex-1 ${isSidebarOpen ? "md:ml-60" : ""} p-4 sm:p-6`}>
//         <div className="max-w-screen-xl sm:flex-row mx-auto space-y-6">
//           {/* Header */}
//           <div className="flex flex-col  sm:justify-between sm:items-center gap-4">
//             <h1 className="text-2xl font-bold text-blue-800">
//               User Management
//             </h1>
//             <div className="flex flex-col  gap-2">
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by name or email"
//                 className="border border-gray-300 rounded-md px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="bg-white rounded-xl shadow overflow-x-auto">
//             {loading ? (
//               <div className="text-center p-10">
//                 <LoadingSpinner />
//               </div>
//             ) : error ? (
//               <div className="p-4 text-red-600">{error}</div>
//             ) : (
//               <table className="min-w-full table-auto text-sm">
//                 <thead className="bg-blue-800 text-white">
//                   <tr>
//                     <th className="p-3 text-left">User Code</th>
//                     <th className="p-3 text-left">Name</th>
//                     <th className="p-3 text-left">Email</th>
//                     <th className="p-3 text-left">Status</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user) => (
//                     <tr key={user._id} className="border-b">
//                       <td className="p-3">{user.userCode}</td>
//                       <td className="p-3">{user.name}</td>
//                       <td className="p-3">{user.email}</td>
//                       <td
//                         className={`p-3 ${
//                           user.isActive ? "text-green-600" : "text-red-600"
//                         }`}
//                       >
//                         {user.isActive ? "Active" : "Inactive"}
//                       </td>
//                       <td className="p-3">
//                         <button
//                           className={`px-3 py-1 rounded-md text-white ${
//                             user.isActive ? "bg-red-500" : "bg-green-600"
//                           }`}
//                           onClick={() =>
//                             handleStatusToggle(user.userCode, user.isActive)
//                           }
//                           disabled={user.isBeingToggled}
//                         >
//                           {user.isActive ? "Deactivate" : "Activate"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Popup */}
//           {popupMessage && (
//             <div
//               className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg z-50 text-white ${
//                 popupType === "success" ? "bg-green-500" : "bg-red-500"
//               }`}
//             >
//               {popupMessage}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import LoadingSpinner from "./LoadingSpinner";

// const Users = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [popupMessage, setPopupMessage] = useState(null);
//   const [popupType, setPopupType] = useState("");

//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API,
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ")
//           ? token
//           : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get("/admin/users");
//         setUsers(response.data.users);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         setError(
//           error.response?.data?.message ||
//             "Failed to load users. Please try again later."
//         );
//       }
//     };
//     fetchUsers();
//   }, []);

//   const getStatusClass = (isActive) =>
//     isActive ? "text-green-500" : "text-red-500";

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" ||
//       (user.isActive ? "Active" : "Inactive") === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusToggle = async (userCode, currentStatus) => {
//     try {
//       if (!userCode) throw new Error("Invalid User ID.");

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.userCode === userCode ? { ...user, isBeingToggled: true } : user
//         )
//       );

//       const response = await api.patch(
//         `/admin/users/${userCode}/toggle-status`
//       );

//       if (response.status === 200) {
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.userCode === userCode
//               ? {
//                   ...user,
//                   isActive: !currentStatus,
//                   isBeingToggled: false,
//                 }
//               : user
//           )
//         );
//         setPopupType("success");
//         setPopupMessage(
//           currentStatus
//             ? "User Deactivated Successfully!"
//             : "User Activated Successfully!"
//         );
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error toggling user status:", error);

//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.userCode === userCode ? { ...user, isBeingToggled: false } : user
//         )
//       );

//       setPopupType("error");
//       setPopupMessage("Failed to update status. Please try again later.");
//     } finally {
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   return (
//     <div className="flex min-h-screen overflow-x-hidden bg-blue-50">
//       <Sidebar isOpen={isSidebarOpen} />
//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "ml-64" : "ml-0"
//         } p-4`}
//       >
//         <div className="max-w-3xl  bg-white shadow-lg rounded-lg p-4">
//           {error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}
//           {loading ? (
//             <div className="text-center text-xl text-blue-500">
//               <LoadingSpinner />
//             </div>
//           ) : (
//             <>
//               <div className="flex justify-between items-center bg-gradient-to-r from-[#3b5779] to-[#273241] text-white p-4 rounded-lg shadow-md mb-4">
//                 <h1 className="text-xl font-bold">Total Users</h1>
//                 <select
//                   className="px-2 py-1 bg-white text-blue-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                   value={filterStatus}
//                 >
//                   <option value="All">All Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm border border-gray-200">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="px-2 py-1 border">User Code</th>
//                       <th className="px-2 py-1 border">Name</th>
//                       <th className="px-1 py-1 border">Email</th>
//                       <th className="px-2 py-1 border">Phone</th>
//                       <th className="px-2 py-1 border">Firm Name</th>
//                       <th className="px-2 py-1 border">Status</th>
//                       <th className="px-2 py-1 border">Created At</th>
//                       <th className="px-2 py-1 border">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredUsers.map((user) => (
//                       <tr key={user._id} className="hover:bg-gray-50">
//                         <td className="px-2 py-1 border break-all">
//                           {user.userCode}
//                         </td>
//                         <td className="px-2 py-1 border break-words">
//                           {user.name}
//                         </td>
//                         <td className="px-1 w-5  py-1 border break-words">
//                           {user.email}
//                         </td>
//                         <td className="px-2 py-1 border break-words">
//                           {user.phoneNumber}
//                         </td>
//                         <td className="px-2 py-1 border break-words">
//                           {user.firmName}
//                         </td>
//                         <td
//                           className={`px-2 py-1 border ${getStatusClass(
//                             user.isActive
//                           )}`}
//                         >
//                           {user.isActive ? "Active" : "Inactive"}
//                         </td>
//                         <td className="px-2 py-1 border">
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-2 py-1 border">
//                           <button
//                             className={`px-2 py-1 text-xs rounded ${
//                               user.isBeingToggled || !user.isActive
//                                 ? "bg-green-500 text-white"
//                                 : "bg-red-500 text-white"
//                             }`}
//                             onClick={() =>
//                               handleStatusToggle(user.userCode, user.isActive)
//                             }
//                             disabled={user.isBeingToggled}
//                           >
//                             {user.isActive ? "Deactivate" : "Activate"}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {popupMessage && (
//         <div
//           className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${
//             popupType === "success"
//               ? "from-green-400 to-green-600"
//               : "from-red-400 to-red-600"
//           } text-white p-5 rounded-lg shadow-lg z-50 w-72`}
//         >
//           <div className="flex justify-between items-center">
//             <p>{popupMessage}</p>
//             <button
//               className="text-white font-bold ml-2 cursor-pointer"
//               onClick={() => setPopupMessage(null)}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../admin/components/sidebar";
import LoadingSpinner from "./LoadingSpinner";
import useWindowSize from "../store/useWindowSize";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "./UI/Table";

const Users = () => {
  const { isMobile, isOpen, setIsOpen } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState("");

  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(
          error.response?.data?.message ||
            "Failed to load users. Please try again later."
        );
      }
    };
    fetchUsers();
  }, []);

  const getStatusClass = (isActive) =>
    isActive ? "text-green-500" : "text-red-500";

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ||
      (user.isActive ? "Active" : "Inactive") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = async (userCode, currentStatus) => {
    try {
      if (!userCode) throw new Error("Invalid User ID.");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userCode === userCode ? { ...user, isBeingToggled: true } : user
        )
      );

      const response = await api.patch(
        `/admin/users/${userCode}/toggle-status`
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.userCode === userCode
              ? {
                  ...user,
                  isActive: !currentStatus,
                  isBeingToggled: false,
                }
              : user
          )
        );
        setPopupType("success");
        setPopupMessage(
          currentStatus
            ? "User Deactivated Successfully!"
            : "User Activated Successfully!"
        );
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userCode === userCode ? { ...user, isBeingToggled: false } : user
        )
      );
      setPopupType("error");
      setPopupMessage("Failed to update status. Please try again later.");
    } finally {
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50 overflow-x-hidden md:(min-width:768px) sm:(min-width:400px) md:p-2 md:text-base sm:p-1 sm:text-sm">
      <Sidebar
        isOpen={isOpen}
        isMobile={isMobile}
        toggleSidebar={() => setIsOpen((prev) => !prev)}
      />
      <div className="mt-20 flex-1 transition-all overflow-hidden duration-300 p-2 flex justify-center items-center md:p-6 md:text-base sm:p-1 sm:text-sm">
        <div className="w-full bg-white shadow-lg rounded-lg p-1 mx-1 sm:mx-1 md:max-w-7xl md:p-3 md:mx-2">
          {error && (
            <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-md text-xs md:mb-3 md:p-3 md:text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-base text-blue-500 md:text-lg">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-gradient-to-r from-[#334c6b] to-[#17313E] text-white px-2 py-2 rounded-lg shadow mb-2 md:px-4 md:py-3 md:mb-3">
                <h1 className="text-base font-bold md:text-lg">Total Users</h1>
                <select
                  className="px-1 py-1 text-xs bg-white text-blue-700 border border-gray-300 rounded md:px-2 md:py-1 md:text-sm"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  value={filterStatus}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="w-full overflow-x-hidden">
                <Table className="w-full table-fixed text-[10px] border border-gray-300 md:text-xs">
                  <TableHeader>
                    <TableRow className="bg-gray-100 text-left">
                      <TableHead className="px-1 py-1 border">Name</TableHead>
                      <TableHead className="px-1 py-1 border">Email</TableHead>
                      <TableHead className="px-1 py-1 border">Phone</TableHead>
                      <TableHead className="px-1 py-1 border">
                        Firm Name
                      </TableHead>
                      <TableHead className="px-1 py-1 border">Status</TableHead>
                      <TableHead className="px-1 py-1 border">
                        Created At
                      </TableHead>
                      <TableHead className="px-1 py-1 border">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-gray-50">
                        <TableCell className="px-1 py-1 border truncate max-w-[80px]">
                          {user.name}
                        </TableCell>
                        <TableCell className="px-1 py-1 border truncate max-w-[100px]">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-1 py-1 border truncate max-w-[80px]">
                          {user.phoneNumber}
                        </TableCell>
                        <TableCell className="px-1 py-1 border truncate max-w-[80px]">
                          {user.firmName}
                        </TableCell>
                        <TableCell
                          className={`px-1 py-1 border ${getStatusClass(
                            user.isActive
                          )}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell className="px-1 py-1 border">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-1 py-1 border">
                          <button
                            className={`px-2 py-1 text-[10px] rounded ${
                              user.isBeingToggled || !user.isActive
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                            onClick={() =>
                              handleStatusToggle(user.userCode, user.isActive)
                            }
                            disabled={user.isBeingToggled}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>

      {popupMessage && (
        <div
          className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${
            popupType === "success"
              ? "from-green-400 to-green-600"
              : "from-red-400 to-red-600"
          } text-white p-2 rounded-lg shadow z-50 w-60 md:p-4 md:w-72`}
        >
          <div className="flex justify-between items-center">
            <p className="text-xs md:text-sm">{popupMessage}</p>
            <button
              className="text-white font-bold ml-2"
              onClick={() => setPopupMessage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
