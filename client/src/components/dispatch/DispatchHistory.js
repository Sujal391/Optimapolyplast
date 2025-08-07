// import React, { useState, useEffect } from "react";
// import axios from "axios";

// // Axios instance with base URL and authorization header
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
//       config.headers.Authorization = token.startsWith("Bearer ")
//         ? token
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const DispatchComponent = () => {
//   // State variables
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Fetch order history
//   const fetchOrderHistory = async () => {
//     try {
//       const response = await api.get("/dispatch/order-history");
//       setOrderHistory(response.data?.orders || []);
//     } catch (error) {
//       console.error("Error fetching order history:", error);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchOrderHistory();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
//         <h1 className="text-2xl font-bold text-blue-600">Dispatch Management</h1>
//       </div> */}

//       {/* Order History Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-3xl font-semibold mb-4 text-green-600">Order History</h2>
//         {orderHistory.length > 0 ? (
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 {/* <th className="py-2 px-4 border-b">Order ID</th> */}
//                 <th className="py-2 px-4 border-b">Customer Name</th>
//                 <th className="py-2 px-4 border-b">Email</th>
//                 <th className="py-2 px-4 border-b">Phone Number</th>
//                 <th className="py-2 px-4 border-b">Firm Name</th>
//                 <th className="py-2 px-4 border-b">Shipping Address</th>
//                 <th className="py-2 px-4 border-b">User Code</th>
//                 <th className="py-2 px-4 border-b">Order Status</th>
//                 <th className="py-2 px-4 border-b">Payment Status</th>
//                 <th className="py-2 px-4 border-b">Payment Method</th>
//                 <th className="py-2 px-4 border-b">Quantity</th>
//                 <th className="py-2 px-4 border-b">Source</th>
//                 <th className="py-2 px-4 border-b">Total Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orderHistory.map((order) => (
//                 <tr key={order._id} className="border">
//                   {/* <td className="py-2 px-4 border-b">{order.orderId ? order.orderId : "N/A"}</td> */}
//                   <td className="py-2 px-4 border-b">{order.user?.name || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.user?.email || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.user?.phoneNumber || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.user?.customerDetails?.firmName || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.shippingAddress || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.user?.customerDetails?.userCode || "N/A"}</td>
//                   <td className="py-2 px-4 border-b">{order.orderStatus}</td>
//                   <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
//                   <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
//                   <td className="py-2 px-4 border-b">
//                     {order.products.map((item, index) => (
//                       <div key={index} className="mb-1">
//                         {item.product?.name || "N/A"}: {item.quantity || 1}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="py-2 px-4 border-b">{order.orderSource}</td>
//                   <td className="py-2 px-4 border-b">₹{order.totalAmount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No order history available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DispatchComponent;



import React, { useState, useEffect } from "react";
import axios from "axios";

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

const DispatchComponent = () => {
  const [orderHistory, setOrderHistory] = useState([]);

  const fetchOrderHistory = async () => {
    try {
      const response = await api.get("/dispatch/order-history");
      setOrderHistory(response.data?.orders || []);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 text-green-600">Order History</h2>
        {orderHistory.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Firm Name</th>
                <th className="py-2 px-4 border-b">Shipping Address</th>
                <th className="py-2 px-4 border-b">User Code</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Source</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => (
                <tr key={order._id} className="border">
                  <td className="py-2 px-4 border-b">{order.user?.name || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{order.user?.email || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{order.user?.phoneNumber || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{order.user?.customerDetails?.firmName || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {order.shippingAddress && typeof order.shippingAddress === 'object'
                      ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}`
                      : order.shippingAddress || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">{order.user?.customerDetails?.userCode || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                  <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
                  <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                  <td className="py-2 px-4 border-b">
                    {order.products.map((item, index) => (
                      <div key={index} className="mb-1">
                        {item.product?.name || "N/A"}: {item.quantity || 1}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">{order.orderSource}</td>
                  <td className="py-2 px-4 border-b">₹{order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No order history available.</p>
        )}
      </div>
    </div>
  );
};

export default DispatchComponent;