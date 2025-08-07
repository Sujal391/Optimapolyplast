
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from './Navbar';


// const api = axios.create({
//   baseURL: "https://rewa-project.onrender.com/api",
// });

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

const CustomerManagement = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    firmName: '',
    gstNumber: '',
    panNumber: '',
    address: '',
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reception/users");
      setCustomers(response.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message || "Failed to load customers. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      alert(validationErrors.join("\n"));
      return;
    }

    try {
      const response = await api.post("/reception/customers", formData);
      alert("Customer registered successfully!");
      fetchCustomers();
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        firmName: '',
        gstNumber: '',
        panNumber: '',
        address: '',
      });
      setShowForm(false);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || "Failed to register customer."}`);
    }
  };

  const validateFormData = (formData) => {
    const errors = [];
    if (!formData.name) errors.push("Name is required.");
    if (!formData.email) errors.push("Email is required.");
    if (!formData.phoneNumber) errors.push("Phone number is required.");
    if (!formData.password) errors.push("Password is required.");
    if (!formData.firmName) errors.push("Firm name is required.");
    if (!formData.address) errors.push("Address is required.");
    return errors;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };

  // Filter customers based on the selected filter
  const filteredCustomers = customers.filter((customer) => {
    if (filter === 'all') return true;
    return filter === 'active' ? customer.isActive : !customer.isActive;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* <Navbar /> */}
    

      {/* Main Content */}
      <div className="max-w-8xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {showForm ? 'Back to Customer List' : '+ Create New User'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && <p className="text-blue-500 text-center">Loading customers...</p>}

        {/* Show the registration form if showForm is true */}
        {showForm ? (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Register New Customer</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium capitalize text-gray-700">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required={key !== 'gstNumber' && key !== 'panNumber'}
                    className="mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
              <div className="col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl p-6 w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer List</h2>

            {/* Filter Controls */}
            <div className="mb-4">
              <label className="mr-2 text-gray-700">Filter by Status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    {['User Code', 'Name', 'Email', 'Phone', 'Firm', 'Status', 'Created At'].map((header) => (
                      <th key={header} className="py-3 px-4 border-b text-left text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.userCode} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="py-3 px-4 text-gray-700">{customer.userCode}</td>
                      <td className="py-3 px-4 text-gray-700">{customer.name}</td>
                      <td className="py-3 px-4 text-gray-700">{customer.email}</td>
                      <td className="py-3 px-4 text-gray-700">{customer.phoneNumber}</td>
                      <td className="py-3 px-4 text-gray-700">{customer.firmName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            customer.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;

