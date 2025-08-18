import cookies from 'js-cookie';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../layout/Sidebar";


const Users = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState("");

  const toggleHeaderDropdown = () => setHeaderDropdownOpen((prev) => !prev);

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
          user.userCode === userCode
            ? { ...user, isBeingToggled: true }
            : user
        )
      );

      const response = await api.patch(`/admin/users/${userCode}/toggle-status`);

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
          user._userCode === userCode ? { ...user, isBeingToggled: false } : user
        )
      );

      setPopupType("error");
      setPopupMessage("Failed to update status. Please try again later.");
    } finally {
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-4`}
      >
        
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-4">
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-xl text-blue-500">
              <div className="spinner">🔄</div>
              Loading users...
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-5 rounded-lg shadow-md mb-6">
                <h1 className="text-3xl font-bold">Total Users</h1>
                <div className="flex space-x-4">
                  <select
                    className="px-4 py-2 bg-white text-blue-700 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    value={filterStatus}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 border border-gray-300 text-left">User Code</th>
                      <th className="p-4 border border-gray-300 text-left">Name</th>
                      <th className="p-4 border border-gray-300 text-left">Email</th>
                      <th className="p-4 border border-gray-300 text-left">Phone</th>
                      <th className="p-4 border border-gray-300 text-left">Firm Name</th>
                      <th className="p-4 border border-gray-300 text-left">Status</th>
                      <th className="p-4 border border-gray-300 text-left">Created At</th>
                      <th className="p-4 border border-gray-300 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="p-4 border border-gray-300">{user.userCode}</td>
                        <td className="p-4 border border-gray-300">{user.name}</td>
                        <td className="p-4 border border-gray-300">{user.email}</td>
                        <td className="p-4 border border-gray-300">
                          {user.phoneNumber}
                        </td>
                        <td className="p-4 border border-gray-300">{user.firmName}</td>
                        <td
                          className={`p-4 border border-gray-300 ${getStatusClass(
                            user.isActive
                          )}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-4 border border-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 border border-gray-300">
                          <button
                            className={`px-4 py-2 rounded ${
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      {popupMessage && (
        <div
          className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${
            popupType === "success"
              ? "from-green-400 to-red-600"
              : "from-green-400 to-red-600"
          } text-white p-5 rounded-lg shadow-lg z-50 transition-transform duration-300 transform scale-105`}
          style={{ width: "300px" }}
        >
          <div className="flex justify-between items-center">
            <p>{popupMessage}</p>
            <button
              className="text-white font-bold ml-2 cursor-pointer"
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

