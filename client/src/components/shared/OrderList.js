// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Sidebar from "../../admin/components/sidebar";
// import profile from "../../assets/profile.jpg";

// const Order = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

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
//         config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }
  
//       const categoryFilter = filterCategory === "All" ? "all" : filterCategory;
//       const response = await api.get(`/admin/orders?type=${categoryFilter}`);
//       const fetchedOrders = response.data.orders;
  
//       const mappedOrders = fetchedOrders.map(order => ({
//         _id: order._id,
//         orderId: order.orderId,
//         customerName: order.user?.name || "N/A",
//         customerEmail: order.user?.email || "N/A",
//         customerPhone: order.user?.phoneNumber || "N/A",
//         firmName: order.firmName || order.user?.customerDetails?.firmName || "N/A",
//         shippingAddress: order.shippingAddress || "N/A",
//         userCode: order.user?.customerDetails?.userCode || "N/A",
//         orderStatus: order.orderStatus || "N/A",
//         paymentStatus: order.paymentStatus || "N/A",
//         paymentMethod: order.paymentMethod || "N/A",
//         products: order.products || [],
//         totalAmount: order.totalAmount || 0,
//         gstNumber: order.gstNumber || "N/A",
//         createdAt: order.createdAt || new Date(),
//         type: order.type || "N/A",
//       }));
  
//       setOrders(mappedOrders);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         setError("Session expired. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("Error loading orders. Please try again later.");
//       }
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadOrderHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('admin/download-order-history', {
//         responseType: 'blob',
//       });

//       if (response.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', 'Order_History.xlsx');
//         document.body.appendChild(link);
//         link.click();
//         link.parentNode.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       } else {
//         throw new Error('Failed to download file');
//       }
//     } catch (error) {
//       setError(
//         error.response
//           ? `Error downloading order history: ${error.response.statusText}`
//           : "Network error occurred. Please check your connection and server status."
//       );
//       console.error('Download error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangeOrderStatus = async (orderId) => {
//     if (window.confirm("Are you sure you want to mark this order as Processing?")) {
//       try {
//         await api.post(`/admin/orders/${orderId}/process`);
//         fetchOrders();
//       } catch {
//         setError("Failed to update order status.");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [filterCategory, filterStatus]);

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       order.orderId.includes(searchTerm) ||
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.firmName.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = filterStatus === "All" || order.orderStatus === filterStatus;

//     return matchesSearch && matchesStatus;
//   });

//   const getStatusClass = (status) => {
//     const statusClasses = {
//       pending: "text-red-600 font-medium",
//       processing: "text-yellow-600 font-medium",
//       confirmed: "text-green-600 font-medium",
//       shipped: "text-blue-600 font-medium",
//       delivered: "text-green-700 font-medium",
//       cancelled: "text-red-700 font-medium",
//     };
//     return statusClasses[status] || "text-gray-700";
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar isOpen={isSidebarOpen} />
//       <div
//         className={`flex-1 transition-all duration-300 ${
//           isSidebarOpen ? "ml-60" : "ml-0"
//         } p-6`}
//       >
//         {/* Main Content Container */}
//         <div className="max-w-7xl mx-auto">
//           {/* Header Section */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-3xl font-bold text-indigo-800">Order Management</h2>
//               <div className="flex space-x-4 items-center">
//                 <select
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
//                   value={filterCategory}
//                   onChange={(e) => setFilterCategory(e.target.value)}
//                 >
//                   <option value="All">All Categories</option>
//                   <option value="Bottle">Bottle</option>
//                   <option value="Raw Material">Raw Material</option>
//                 </select>
//                 <select
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
//                   value={filterStatus}
//                   onChange={(e) => setFilterStatus(e.target.value)}
//                 >
//                   <option value="All">All Status</option>
//                   <option value="processing">Processing</option>
//                   <option value="pending">Pending</option>
//                   <option value="preview">Preview</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//                 <button
//                   onClick={handleDownloadOrderHistory}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
//                   disabled={loading}
//                 >
//                   {loading ? "Downloading..." : "Download History"}
//                 </button>
//               </div>
//             </div>
//             {/* Search Bar */}
//             <div className="mt-4">
//               <input
//                 type="text"
//                 placeholder="Search by Order ID, Customer Name, or Firm Name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl shadow-md">
//               {error}
//             </div>
//           )}

//           {/* Table Container */}
//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             {loading ? (
//               <div className="text-center py-10 text-xl text-indigo-600 animate-pulse">
//                 Loading orders...
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead className="bg-indigo-700 text-white">
//                     <tr>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Order ID</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Customer Name</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Phone Number</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Firm Name</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Shipping Address</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">User Code</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Order Status</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Payment Status</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Payment Method</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Quantity</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Total Amount</th>
//                       <th className="py-3 px-4 text-left text-sm font-semibold">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredOrders.map((order, index) => (
//                       <tr
//                         key={order._id}
//                         className={`${
//                           index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                         } hover:bg-indigo-50 transition-colors`}
//                       >
//                         <td className="py-3 px-4 text-gray-800">{order.orderId}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.customerName}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.customerEmail}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.customerPhone}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.firmName}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.shippingAddress}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.userCode}</td>
//                         <td className={`py-3 px-4 ${getStatusClass(order.orderStatus)}`}>
//                           {order.orderStatus}
//                         </td>
//                         <td className="py-3 px-4 text-gray-800">{order.paymentStatus}</td>
//                         <td className="py-3 px-4 text-gray-800">{order.paymentMethod}</td>
//                         <td className="py-3 px-4 text-gray-800">
//                           {order.products.map((item, index) => (
//                             <div key={index} className="mb-1">
//                               {item.product?.name || "N/A"}: {item.quantity || 1}
//                             </div>
//                           ))}
//                         </td>
//                         <td className="py-3 px-4 text-gray-800">₹{order.totalAmount}</td>
//                         <td className="py-3 px-4">
//                           {order.orderStatus === "preview" && (
//                             <button
//                               onClick={() => handleChangeOrderStatus(order._id)}
//                               className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors text-sm"
//                             >
//                               Mark as Processing
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Order;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import profile from "../../assets/profile.jpg";

const Order = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
  
      const categoryFilter = filterCategory === "All" ? "all" : filterCategory;
      const response = await api.get(`/admin/orders?type=${categoryFilter}`);
      const fetchedOrders = response.data.orders;
  
      const mappedOrders = fetchedOrders.map(order => ({
        _id: order._id,
        orderId: order.orderId,
        customerName: order.user?.name || "N/A",
        customerEmail: order.user?.email || "N/A",
        customerPhone: order.user?.phoneNumber || "N/A",
        firmName: order.firmName || order.user?.customerDetails?.firmName || "N/A",
        shippingAddress: order.shippingAddress || "N/A",
        userCode: order.user?.customerDetails?.userCode || "N/A",
        orderStatus: order.orderStatus || "N/A",
        paymentStatus: order.paymentStatus || "N/A",
        paymentMethod: order.paymentMethod || "N/A",
        products: order.products || [],
        totalAmount: order.totalAmount || 0,
        gstNumber: order.gstNumber || "N/A",
        createdAt: order.createdAt || new Date(),
        type: order.type || "N/A",
      }));
  
      setOrders(mappedOrders);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Error loading orders. Please try again later.");
      }
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('admin/download-order-history', {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Order_History.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      setError(
        error.response
          ? `Error downloading order history: ${error.response.statusText}`
          : "Network error occurred. Please check your connection and server status."
      );
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOrderStatus = async (orderId) => {
    if (window.confirm("Are you sure you want to mark this order as Processing?")) {
      try {
        await api.post(`/admin/orders/${orderId}/process`);
        fetchOrders();
      } catch {
        setError("Failed to update order status.");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterCategory, filterStatus]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderId.includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firmName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || order.orderStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: "text-red-600 font-medium",
      processing: "text-yellow-600 font-medium",
      confirmed: "text-green-600 font-medium",
      shipped: "text-blue-600 font-medium",
      delivered: "text-green-700 font-medium",
      cancelled: "text-red-700 font-medium",
    };
    return statusClasses[status] || "text-gray-700";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-60" : "ml-0"
        } p-6`}
      >
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-indigo-800">Order Management</h2>
              <div className="flex space-x-4 items-center">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Raw Material">Raw Material</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="preview">Preview</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleDownloadOrderHistory}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                  disabled={loading}
                >
                  {loading ? "Downloading..." : "Download History"}
                </button>
              </div>
            </div>
            {/* Search Bar */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Firm Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl shadow-md">
              {error}
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-10 text-xl text-indigo-600 animate-pulse">
                Loading orders...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-indigo-700 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Order ID</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Customer Name</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Phone Number</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Firm Name</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Shipping Address</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">User Code</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Order Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Payment Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Payment Method</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Quantity</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Total Amount</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order._id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-indigo-50 transition-colors`}
                      >
                        <td className="py-3 px-4 text-gray-800">{order.orderId}</td>
                        <td className="py-3 px-4 text-gray-800">{order.customerName}</td>
                        <td className="py-3 px-4 text-gray-800">{order.customerEmail}</td>
                        <td className="py-3 px-4 text-gray-800">{order.customerPhone}</td>
                        <td className="py-3 px-4 text-gray-800">{order.firmName}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {order.shippingAddress && typeof order.shippingAddress === 'object'
                            ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}`
                            : order.shippingAddress || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-gray-800">{order.userCode}</td>
                        <td className={`py-3 px-4 ${getStatusClass(order.orderStatus)}`}>
                          {order.orderStatus}
                        </td>
                        <td className="py-3 px-4 text-gray-800">{order.paymentStatus}</td>
                        <td className="py-3 px-4 text-gray-800">{order.paymentMethod}</td>
                        <td className="py-3 px-4 text-gray-800">
                          {order.products.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.product?.name || "N/A"}: {item.quantity || 1}
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-gray-800">₹{order.totalAmount}</td>
                        <td className="py-3 px-4">
                          {order.orderStatus === "preview" && (
                            <button
                              onClick={() => handleChangeOrderStatus(order._id)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                            >
                              Mark as Processing
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;