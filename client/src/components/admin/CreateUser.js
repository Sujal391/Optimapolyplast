import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import cookies from 'js-cookie';


// const api = axios.create({
//   baseURL: "https://rewa-project.onrender.com/api",
// });

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const CreatedUsers = () => {
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
  const [roles, setRoles] = useState(["reception", "stock", "dispatch", "marketing", "miscellaneous"]);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/staff");
      setStaff(response.data.staff);
      // Initialize password visibility state for each staff member
      const initialPasswordVisibility = {};
      response.data.staff.forEach(member => {
        initialPasswordVisibility[member._id] = false;
      });
      setShowStaffPassword(initialPasswordVisibility);
    } catch (err) {
      console.error('Fetch Error:', err);
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
    console.log('Profile Data:', profileData);

    // const token = localStorage.getItem("token");
    const token = cookies.get("token");
    if (!token) {
      setToastMessage({ message: "Authorization token missing or expired.", type: "error" });
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/auth/register/staff", profileData);
      setToastMessage({ message: "Staff added successfully!", type: "success" });
      fetchStaff();
      setIsModalOpen(false);
      // Clear form fields
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
    } catch (error) {
      console.error('Error:', error.response || error);
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
        setToastMessage({ message: "Staff deleted successfully!", type: "success" });
        fetchStaff();
      } catch (error) {
        console.error('Delete Error:', error);
        setToastMessage({ message: "Failed to delete staff.", type: "error" });
      }
    }
  };

  const togglePasswordVisibility = (memberId) => {
    setShowStaffPassword(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
 
      <div className="w-64 bg-gray-800 text-white h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 rounded-3xl">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl mt-6">
          <div className="flex items-center justify-between p-6 border-b bg-blue-700">
            <h1 className="text-3xl text-white">Created Panels</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200">
              ➕ Create New User
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="table-auto w-full text-lg text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone Number</th>
                  <th className="px-4 py-2">Role</th>
                  {/* <th className="px-4 py-2">Password</th> */}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className="px-4 py-2 t">{member.phoneNumber}</td>
                    <td className="px-4 py-2 t">{member.role}</td>
                    {/* <td className="px-4 py-2"> */}
                      {/* <div className="flex items-center">
                        <span className="mr-2">
                          {showStaffPassword[member._id] ? member.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(member._id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {showStaffPassword[member._id] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div> */}
                    {/* </td> */}
                    <td className="px-4 py-2">
                      {/* <button className=" hover:underline">✏️</button> */}
                      <button onClick={() => handleDelete(member._id)} className="ml-0 text-red-500 bg-red-200 hover:bg-red-400 hover:text-red-700 px-3 py-2 rounded-lg">
                    Delete🗑️
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {toastMessage && (
            <div className={`fixed bottom-4 right-4 bg-${toastMessage.type === "success" ? "green" : "red"}-500 text-white px-4 py-2 rounded-lg`}>
              {toastMessage.message}
              <button onClick={closeToast} className="ml-4 text-sm underline">
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((roleOption, index) => (
                    <option key={index} value={roleOption}>{roleOption}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="mr-2 text-gray-500">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedUsers;