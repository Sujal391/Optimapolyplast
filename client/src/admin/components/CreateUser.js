import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useWindowSize from "../store/useWindowSize";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CreatedUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState();
  const { isMobile, isOpen, setIsOpen } = useWindowSize();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showStaffPassword, setShowStaffPassword] = useState({});
  const [roles] = useState([
    "reception",
    "stock",
    "dispatch",
    "marketing",
    "miscellaneous",
  ]);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/staff");
      setStaff(response.data.staff);
      const initialPasswordVisibility = {};
      response.data.staff.forEach((member) => {
        initialPasswordVisibility[member._id] = false;
      });
      setShowStaffPassword(initialPasswordVisibility);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load staff. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { name, email, phoneNumber: phone, password, role };

    const token = localStorage.getItem("token");
    if (!token) {
      setToastMessage({
        message: "Authorization token missing or expired.",
        type: "error",
      });
      navigate("/login");
      return;
    }

    try {
      await api.post("/auth/register/staff", profileData);
      setToastMessage({
        message: "Staff added successfully!",
        type: "success",
      });
      fetchStaff();
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
    } catch (error) {
      console.error("Error:", error.response || error);
      setToastMessage({
        message: error.response?.data?.message || "Failed to add staff.",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await api.delete(`/admin/staff/${id}`);
        setToastMessage({
          message: "Staff deleted successfully!",
          type: "success",
        });
        fetchStaff();
      } catch (error) {
        console.error("Delete Error:", error);
        setToastMessage({ message: "Failed to delete staff.", type: "error" });
      }
    }
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex w-full">
      <Sidebar
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* <div className="flex-1 p-4 flex flex-col items-center w-full overflow-x-hidden">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between p-4 border-b bg-[#1c3947]">
            <h1 className="text-3xl text-white">Created Panels</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200"
            >
              ➕ Create New User
            </button>
          </div>

          <div className="w-full overflow-x-auto p-4">
            <table className="min-w-[700px] text-sm sm:text-base text-left border-collapse w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone Number</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="px-2 py-2">{member.name}</td>
                    <td className="px-2 py-2">{member.email}</td>
                    <td className="px-2 py-2">{member.phoneNumber}</td>
                    <td className="px-2 py-2">{member.role}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-500 bg-red-200 hover:bg-red-400 hover:text-white px-3 py-1 rounded-lg"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {toastMessage && (
            <div
              className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
                toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {toastMessage.message}
              <button onClick={closeToast} className="ml-4 text-sm underline">
                Close
              </button>
            </div>
          )}
        </div>
      </div> */}

      <div className="flex-1 mt-20 p-4 flex flex-col items-center w-full overflow-x-hidden">
        <div className="w-full max-w-7xl">
          <div className="flex items-center justify-between p-4 border-b bg-[#1c3947]">
            <h1 className="text-3xl text-white">Created Panels</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200"
            >
              ➕ Create New User
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block w-full p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone Number</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2">{member.phoneNumber}</td>
                    <td className="px-4 py-2">{member.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-500 bg-red-200 hover:bg-red-400 hover:text-white px-3 py-1 rounded-lg"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden w-full p-4 space-y-4">
            {staff.map((member) => (
              <div
                key={member._id}
                className="border rounded-lg p-4 shadow bg-white space-y-2"
              >
                <p>
                  <strong>Name:</strong> {member.name}
                </p>
                <p>
                  <strong>Email:</strong> {member.email}
                </p>
                <p>
                  <strong>Phone:</strong> {member.phoneNumber}
                </p>
                <p>
                  <strong>Role:</strong> {member.role}
                </p>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="mt-2 text-red-500 bg-red-100 hover:bg-red-300 px-3 py-1 rounded"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>

          {toastMessage && (
            <div
              className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
                toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {toastMessage.message}
              <button onClick={closeToast} className="ml-4 text-sm underline">
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed md:flex-row md:justify-between md:items-center inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 block sm:hidden rounded-xl shadow-lg w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-2 py-2 border rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-2 py-2 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  className="w-full px-2 py-2 border rounded-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-2 py-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-2 py-2 border rounded-lg"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedUsers;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "./sidebar";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import useWindowSize from "../store/useWindowSize";

// // const api = axios.create({
// //   baseURL: "https://rewa-project.onrender.com/api",
// // });

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const CreatedUsers = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState();
//   const { isMobile, isOpen, setIsOpen } = useWindowSize();
//   const [staff, setStaff] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showStaffPassword, setShowStaffPassword] = useState({});
//   const [roles, setRoles] = useState([
//     "reception",
//     "stock",
//     "dispatch",
//     "marketing",
//     "miscellaneous",
//   ]);
//   const navigate = useNavigate();

//   const fetchStaff = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/admin/staff");
//       setStaff(response.data.staff);
//       // Initialize password visibility state for each staff member
//       const initialPasswordVisibility = {};
//       response.data.staff.forEach((member) => {
//         initialPasswordVisibility[member._id] = false;
//       });
//       setShowStaffPassword(initialPasswordVisibility);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       if (err.response?.status === 401) {
//         setError("Session expired. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("Failed to load staff. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const profileData = { name, email, phoneNumber: phone, password, role };
//     console.log("Profile Data:", profileData);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setToastMessage({
//         message: "Authorization token missing or expired.",
//         type: "error",
//       });
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await api.post("/auth/register/staff", profileData);
//       setToastMessage({
//         message: "Staff added successfully!",
//         type: "success",
//       });
//       fetchStaff();
//       setIsModalOpen(false);
//       // Clear form fields
//       setName("");
//       setEmail("");
//       setPhone("");
//       setPassword("");
//       setRole("");
//     } catch (error) {
//       console.error("Error:", error.response || error);
//       setToastMessage({
//         message: error.response?.data?.message || "Failed to add staff.",
//         type: "error",
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this staff member?")) {
//       try {
//         await api.delete(`/admin/staff/${id}`);
//         setToastMessage({
//           message: "Staff deleted successfully!",
//           type: "success",
//         });
//         fetchStaff();
//       } catch (error) {
//         console.error("Delete Error:", error);
//         setToastMessage({ message: "Failed to delete staff.", type: "error" });
//       }
//     }
//   };

//   const togglePasswordVisibility = (memberId) => {
//     setShowStaffPassword((prev) => ({
//       ...prev,
//       [memberId]: !prev[memberId],
//     }));
//   };

//   const closeToast = () => {
//     setToastMessage(null);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="flex">
//       <Sidebar
//         isOpen={isSidebarOpen}
//         isMobile={isMobile}
//         toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
//       />

//       <div className="flex-1 p-4 rounded-3xl flex justify-center items-center overflow-hidden">
//         <div className="w-full max-w-7xl">
//           <div className="flex items-center max-w-7xl sm:p-1 justify-between p-4 border-b bg-[#1c3947]">
//             <h1 className="text-3xl text-white">Created Panels</h1>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200"
//             >
//               ➕ Create New User
//             </button>
//           </div>

//           <div className="overflow-x-auto p-4">
//             <table className="min-w-[600px] table-auto w-full text-lg text-left border-collapse">
//               <thead>
//                 <tr>
//                   <th className="px-2 py-2">Name</th>
//                   <th className="px-2 py-2">Email</th>
//                   <th className="px-2 py-2">Phone Number</th>
//                   <th className="px-2 py-2">Role</th>
//                   {/* <th className="px-4 py-2">Password</th> */}
//                   <th className="px-2 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staff.map((member) => (
//                   <tr key={member._id} className="border-t">
//                     <td className="px-2 py-2">{member.name}</td>
//                     <td className="px-2 py-2">{member.email}</td>
//                     <td className="px-2 py-2 ">{member.phoneNumber}</td>
//                     <td className="px-2 py-2 ">{member.role}</td>
//                     {/* <td className="px-4 py-2"> */}
//                     {/* <div className="flex items-center">
//                         <span className="mr-2">
//                           {showStaffPassword[member._id] ? member.password : '••••••••'}
//                         </span>
//                         <button
//                           onClick={() => togglePasswordVisibility(member._id)}
//                           className="text-gray-500 hover:text-gray-700"
//                         >
//                           {showStaffPassword[member._id] ? <FaEyeSlash /> : <FaEye />}
//                         </button>
//                       </div> */}
//                     {/* </td> */}
//                     <td className="px-2 py-2">
//                       {/* <button className=" hover:underline">✏️</button> */}
//                       <button
//                         onClick={() => handleDelete(member._id)}
//                         className="ml-0 text-red-500 bg-red-200 hover:bg-red-400 hover:text-red-700 px-2 py-2 rounded-lg"
//                       >
//                         Delete🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {toastMessage && (
//             <div
//               className={`fixed bottom-4 right-4 bg-${
//                 toastMessage.type === "success" ? "green" : "red"
//               }-500 text-white px-4 py-2 rounded-lg`}
//             >
//               {toastMessage.message}
//               <button onClick={closeToast} className="ml-4 text-sm underline">
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
//             <h2 className="text-xl font-bold mb-4">Add New User</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   type="text"
//                   id="phone"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     id="password"
//                     className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-3 text-gray-500"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Role
//                 </label>
//                 <select
//                   id="role"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   required
//                 >
//                   <option value="">Select a role</option>
//                   {roles.map((roleOption, index) => (
//                     <option key={index} value={roleOption}>
//                       {roleOption}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="mr-2 text-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreatedUsers;
