// Pattern 1

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import profile from "../../assets/profile.jpg";

// const Dashboard = () => {
//   const [stats, setStats] = useState(null); // State to store dashboard stats
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state

//   // Axios instance with interceptor
//   const api = axios.create({
//     baseURL: "https://rewa-project.onrender.com/api",
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

//   // Fetch Dashboard Stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await api.get("/admin/dashboard/stats");
//         setStats(response.data.stats); // Update stats state with API data
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           setError("Session expired. Please login again.");
//           localStorage.removeItem("token"); // Clear invalid token
//           window.location.href = "/"; // Redirect to login page
//         } else {
//           setError("Error fetching stats. Please try again later.");
//         }
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   // Cards for metrics
//   const cards = stats
//     ? [
//         {
//           title: "Total Users",
//           value: stats.users.total,
//           description: `Active: ${stats.users.active}, Inactive: ${stats.users.inactive}`,
//           icon: "👥",
//           color: "text-blue-500",
//         },
//         {
//           title: "Total Products",
//           value: stats.products.total,
//           description: `Bottles: ${stats.products.bottles}, Raw Materials: ${stats.products.rawMaterials}`,
//           icon: "📦",
//           color: "text-green-500",
//         },
//         {
//           title: "Total Orders",
//           value:
//             stats.orders.pending +
//             stats.orders.confirmed +
//             stats.orders.shipped +
//             stats.orders.delivered +
//             stats.orders.cancelled,
//           description: `Delivered: ${stats.orders.delivered}, Pending: ${stats.orders.pending}`,
//           icon: "📋",
//           color: "text-purple-500",
//         },
//       ]
//     : [];

//   // Order Breakdown
//   const orderStats = stats
//     ? [
//         { status: "Pending", count: stats.orders.pending },
//         { status: "Confirmed", count: stats.orders.confirmed },
//         { status: "Shipped", count: stats.orders.shipped },
//         { status: "Delivered", count: stats.orders.delivered },
//         { status: "Cancelled", count: stats.orders.cancelled },
//         { status: "Preview", count: stats.orders.preview },
//         { status: "Processing", count: stats.orders.processing },
//       ]
//     : [];

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 ml-16 md:ml-64 transition-all duration-300 bg-gray-100 min-h-screen p-5">
//         {/* Top Navigation */}
//         <header className="flex justify-between items-center bg-white p-4 rounded shadow">
//           <h1 className="text-xl font-semibold">Admin Dashboard</h1>

//           <div className="flex items-center">
//             <input
//               type="text"
//               className="border p-2 rounded-md"
//               placeholder="Search"
//             />
//             <button className="ml-2">🔍</button>
//           </div>

//           <div className="flex items-center gap-3">
//             <div>
//               <h2 className="font-semibold">Salman Sawant</h2>
//               <p className="text-sm text-gray-500">Admin</p>
//             </div>
//             <img
//               src={profile}
//               alt="Admin"
//               className="rounded-full w-10 h-10"
//             />
//           </div>
//         </header>

//         {/* Metrics Cards */}
//         {loading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div className="text-red-500">Error: {error}</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
//             {cards.map((card, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-4 rounded shadow flex flex-col items-center text-center"
//               >
//                 <div className={`text-5xl ${card.color}`}>{card.icon}</div>
//                 <h3 className="text-lg font-semibold mt-2">{card.title}</h3>
//                 <p className="text-2xl font-bold mt-1">{card.value}</p>
//                 <p className="text-sm text-gray-600 mt-1">{card.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Orders Table */}
//         {stats && (
//           <div className="bg-white mt-5 p-4 rounded shadow">
//             <h2 className="text-xl font-semibold mb-4">Order Breakdown</h2>
//             <table className="w-full table-auto border-collapse">
//               <thead>
//                 <tr className="border-b">
//                   <th className="p-2 text-left">Status</th>
//                   <th className="p-2 text-left">Count</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderStats.map((order, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">{order.status}</td>
//                     <td className="p-2">{order.count}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


//Pattern 2

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import profile from "../../assets/profile.jpg";


// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const api = axios.create({
//     baseURL: "https://rewa-project.onrender.com/api",
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
//     const fetchStats = async () => {
//       try {
//         const response = await api.get("/admin/dashboard/stats");
//         setStats(response.data.stats);
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           setError("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           window.location.href = "/";
//         } else {
//           setError("Error fetching stats. Please try again later.");
//         }
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const cards = stats
//     ? [
//         {
//           title: "Total Users",
//           value: stats.users.total,
//           description: `Active: ${stats.users.active}, Inactive: ${stats.users.inactive}`,
//           icon: "👥",
//           color: "text-blue-500",
//         },
//         {
//           title: "Total Products",
//           value: stats.products.total,
//           description: `Bottles: ${stats.products.bottles}, Raw Materials: ${stats.products.rawMaterials}`,
//           icon: "📦",
//           color: "text-green-500",
//         },
//         {
//           title: "Total Orders",
//           value:
//             stats.orders.pending +
//             stats.orders.confirmed +
//             stats.orders.shipped +
//             stats.orders.delivered +
//             stats.orders.cancelled,
//           description: `Delivered: ${stats.orders.delivered}, Pending: ${stats.orders.pending}`,
//           icon: "📋",
//           color: "text-purple-500",
//         },
//       ]
//     : [];

//   const orderStats = stats
//     ? [
//         { status: "Pending", count: stats.orders.pending, color: "bg-yellow-500" },
//         { status: "Confirmed", count: stats.orders.confirmed, color: "bg-blue-500" },
//         { status: "Shipped", count: stats.orders.shipped, color: "bg-indigo-500" },
//         { status: "Delivered", count: stats.orders.delivered, color: "bg-green-500" },
//         { status: "Cancelled", count: stats.orders.cancelled, color: "bg-red-500" },
//         { status: "Preview", count: stats.orders.preview, color: "bg-gray-500" },
//         { status: "Processing", count: stats.orders.processing, color: "bg-orange-500" },
//       ]
//     : [];

//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="flex-1 ml-16 md:ml-64 transition-all duration-300 bg-gray-100 min-h-screen p-5">
//         <header className="flex justify-between items-center bg-white p-4 rounded shadow">
//           <h1 className="text-xl font-semibold">Admin Dashboard</h1>

//           <div className="flex items-center">
//             <input
//               type="text"
//               className="border p-2 rounded-md"
//               placeholder="Search"
//             />
//             <button className="ml-2">🔍</button>
//           </div>

//           <div className="flex items-center gap-3">
//             <div>
//               <h2 className="font-semibold">Salman Sawant</h2>
//               <p className="text-sm text-gray-500">Admin</p>
//             </div>
//             <img
//               src={profile}
//               alt="Admin"
//               className="rounded-full w-10 h-10"
//             />
//           </div>
//         </header>

//         {loading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div className="text-red-500">Error: {error}</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
//             {cards.map((card, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-4 rounded shadow flex flex-col items-center text-center"
//               >
//                 <div className={`text-5xl ${card.color}`}>{card.icon}</div>
//                 <h3 className="text-lg font-semibold mt-2">{card.title}</h3>
//                 <p className="text-2xl font-bold mt-1">{card.value}</p>
//                 <p className="text-sm text-gray-600 mt-1">{card.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {stats && (
//           <div className="bg-white mt-5 p-4 rounded shadow">
//             <h2 className="text-xl font-bold mb-6">Order Breakdown</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {orderStats.map((order, index) => (
//                 <div
//                   key={index}
//                   className="flex flex-col items-start bg-gray-50 p-4 rounded-lg shadow-lg border-l-4 border-gray-300"
//                 >
//                   <div className="flex items-center justify-between w-full">
//                     <h3 className="text-lg font-bold text-gray-700">{order.status}</h3>
//                     <span
//                       className={`px-3 py-1 text-sm rounded-full text-white ${order.color}`}
//                     >
//                       {order.count}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2">
//                     Orders in {order.status.toLowerCase()} status.
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// Pattern 3

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";
// import profile from "../../assets/profile.jpg";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Add this line

//   const api = axios.create({
//     baseURL: "https://rewa-project.onrender.com/api",
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
//     const fetchStats = async () => {
//       try {
//         const response = await api.get("/admin/dashboard/stats");
//         setStats(response.data.stats);
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 401) {
//           setError("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           window.location.href = "/";
//         } else {
//           setError("Error fetching stats. Please try again later.");
//         }
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const cards = stats
//     ? [
//         {
//           title: "Total Users",
//           value: stats.users.total,
//           description: `Active: ${stats.users.active}, Inactive: ${stats.users.inactive}`,
//           icon: "👥",
//           color: "bg-white-500",
//         },
//         {
//           title: "Total Products",
//           value: stats.products.total,
//           description: `Bottles: ${stats.products.bottles}, Raw Materials: ${stats.products.rawMaterials}`,
//           icon: "📦",
//           color: "bg-white-500",
//         },
//         {
//           title: "Total Orders",
//           value:
//             stats.orders.pending +
//             stats.orders.confirmed +
//             stats.orders.shipped +
//             stats.orders.delivered +
//             stats.orders.cancelled,
//           description: `Delivered: ${stats.orders.delivered}, Pending: ${stats.orders.pending}`,
//           icon: "📋",
//           color: "bg-white-500",
//         },
//       ]
//     : [];

//   const orderStats = stats
//     ? [
//         { status: "Pending", count: stats.orders.pending, color: "bg-yellow-500" },
//         { status: "Confirmed", count: stats.orders.confirmed, color: "bg-blue-500" },
//         { status: "Shipped", count: stats.orders.shipped, color: "bg-indigo-500" },
//         { status: "Delivered", count: stats.orders.delivered, color: "bg-green-500" },
//         { status: "Cancelled", count: stats.orders.cancelled, color: "bg-red-500" },
//         { status: "Preview", count: stats.orders.preview, color: "bg-gray-500" },
//         { status: "Processing", count: stats.orders.processing, color: "bg-orange-500" },
//       ]
//     : [];

//   const toggleHeaderDropdown = () => {
//     setHeaderDropdownOpen((prev) => !prev);
//   };

//   return (
//     <div className="flex">
//       <Sidebar isOpen={isSidebarOpen} />

//      <div
//         className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} p-4`}
//       >
//         <header className="flex justify-between items-center bg-white p-4 rounded shadow">
//           <h1 className="text-3xl font-semibold text-blue-700">Admin Dashboard</h1>
//           <div className="flex items-center">
//             <input
//               type="text"
//               className="border p-2 rounded-md"
//               placeholder="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="ml-2 text-blue-500">🔍</button>
//           </div>
//           <div className="flex items-center">
//             <div>
//                <h2 className="font-semibold">Salman Sawant</h2>
//                <p className="text-sm text-gray-500">Admin</p>
//             </div>
//             <img src={profile} alt="Admin" className="rounded-full w-10 h-10 ml-3" />
//             <div className="relative ml-3">
//   <button
//     className="text-lg px-3 py-1 border rounded-md"
//     onClick={toggleHeaderDropdown}
//   >
//     ▼
//   </button>
//   {headerDropdownOpen && (
//     <div
//       className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50"
//       style={{ top: "100%" }} // Ensure it shows below the button
//     >
//       <ul className="py-1">
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//           <Link to="/profile">Profile</Link>
//         </li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//           <Link to="/settings">Settings</Link>
//         </li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
//           <Link to="/">Logout</Link>
//         </li>
//       </ul>
//     </div>
//   )}
// </div>

//           </div>
//         </header>
//         <br />
//         {loading ? (
//           <div className="text-center text-xl text-gray-600 mt-8">Loading...</div>
//         ) : error ? (
//           <div className="text-center text-red-500 font-semibold mt-8">{error}</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//             {cards.map((card, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
//               >
//                 <div className={`text-5xl ${card.color} text-center`}>{card.icon}</div>
//                 <h3 className="text-lg font-semibold mt-4 text-center">{card.title}</h3>
//                 <p className="text-2xl font-bold mt-2 text-center">{card.value}</p>
//                 <p className="text-sm text-gray-600 mt-2 text-center">{card.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

        // {stats && (
        //   <div className="bg-white mt-8 p-6 rounded-lg shadow-lg">
        //     <h2 className="text-2xl font-bold text-gray-700 mb-6">Order Breakdown</h2>
        //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //       {orderStats.map((order, index) => (
        //         <div
        //           key={index}
        //           className="flex flex-col items-start bg-gray-50 p-6 rounded-lg shadow-lg border-l-4 border-gray-300 transform transition-all hover:scale-105 hover:shadow-xl"
        //         >
        //           <div className="flex items-center justify-between w-full">
        //             <h3 className="text-lg font-semibold text-gray-700">{order.status}</h3>
        //             <span
        //               className={`px-3 py-1 text-sm rounded-full text-white ${order.color}`}
        //             >
        //               {order.count}
        //             </span>
        //           </div>
        //           <p className="text-sm text-gray-600 mt-3">
        //             Orders in {order.status.toLowerCase()} status.
        //           </p>
        //         </div>
        //       ))}
        //     </div>
        //   </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../admin/components/sidebar";
import profile from "../../assets/profile.jpg";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");
        setStats(response.data.stats);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          setError("Error fetching stats. Please try again later.");
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          title: "Total Users",
          value: stats.users.total,
          description: `Active: ${stats.users.active}, Inactive: ${stats.users.inactive}`,
          icon: "👥",
        },
        {
          title: "Total Products",
          value: stats.products.total,
          description: `Bottles: ${stats.products.bottles}, Raw Materials: ${stats.products.rawMaterials}`,
          icon: "📦",
        },
        {
          title: "Total Orders",
          value:
            stats.orders.pending +
            stats.orders.confirmed +
            stats.orders.shipped +
            // stats.orders.delivered +
            stats.orders.cancelled +
            stats.orders.preview + 
            stats.orders.processing,
          description: `Shipped: ${stats.orders.shipped}, Pending: ${stats.orders.pending}`,
          icon: "📋",
        },
      ]
    : [];

  const orderStats = stats
    ? [
        { status: "Pending", count: stats.orders.pending, color: "bg-yellow-500" },
        { status: "Confirmed", count: stats.orders.confirmed, color: "bg-blue-500" },
        { status: "Shipped", count: stats.orders.shipped, color: "bg-indigo-500" },
        // { status: "Delivered", count: stats.orders.delivered, color: "bg-green-500" },
        { status: "Cancelled", count: stats.orders.cancelled, color: "bg-red-500" },
        { status: "Preview", count: stats.orders.preview, color: "bg-gray-500" },
        { status: "Processing", count: stats.orders.processing, color: "bg-orange-500" },
      ]
    : [];

  const toggleHeaderDropdown = () => {
    setHeaderDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-4`}
      >
        {/* Dashboard Cards */}
        {loading ? (
          <div className="text-center text-xl text-gray-600 mt-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold mt-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-700 to-purple-700 text-white transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-center">
                  <div className="text-6xl">{card.icon}</div>
                </div>
                <div className="flex-1" />
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-2xl font-semibold">{card.title}</h3>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <p className="text-sm text-gray-200">{card.description}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-900 flex items-center justify-center text-white text-4xl font-bold">{card.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Breakdown */}
        {stats && (
  <div className="bg-gradient-to-br from-blue-600 to-purple-700 mt-8 p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold text-gray-100 mb-6">Order Breakdown</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orderStats.map((order, index) => (
        <div
          key={index}
          className={`flex flex-col items-start p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl ${order.color} text-white border-l-4`}
        >
          <div className="flex items-center justify-between w-full">
            <h3 className="text-3xl font-semibold">{order.status}</h3>
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-white ${order.color} bg-gradient-to-br from-blue-400 to-purple-900 shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl`}
            >
              <span className="text-4xl">{order.count}</span>
            </div>
          </div>
          <p className="text-lg mt-3">{`Orders in ${order.status.toLowerCase()} status.`}</p>
        </div>
      ))}
    </div>
  </div>
)}
  </div>
    </div>
  );
};

export default Dashboard;