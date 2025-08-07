// import React, { useState, useEffect } from 'react';
// import axios from 'axios';



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

// const DeliveryCharge = () => {
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Fetch Pending Orders
//   const fetchPendingOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/reception/orders/pending");
//       console.log(response.data); // Log the response to inspect the structure
//       setPendingOrders(response.data.orders);
//     } catch (err) {
//       setError('Error fetching pending orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Add Delivery Charge
//   const addDeliveryCharge = async () => {
//     if (!selectedOrderId || deliveryCharge <= 0) {
//       setError('Invalid order ID or delivery charge');
//       return;
//     }

//     try {
//       const response = await api.post("/reception/orders/add-delivery-charge", {
//         orderId: selectedOrderId,
//         deliveryCharge,
//       });
//       setSuccessMessage(response.data.message);
//       setError('');
//       setDeliveryCharge(0);
//       setSelectedOrderId(null);
//       fetchPendingOrders(); // Refresh the order list after adding the charge
//     } catch (err) {
//       setError('Error adding delivery charge');
//     }
//   };

//   // Get Payment Status Color
//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       'paid': 'text-green-600',
//       'pending': 'text-yellow-600',
//       'failed': 'text-red-600'
//     };
//     return colors[status?.toLowerCase()] || 'text-gray-600';
//   };

//   useEffect(() => {
//     fetchPendingOrders();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold text-center mb-6">Delivery Charges Orders</h1>

//       {error && <p className="text-red-500 text-center">{error}</p>}
//       {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
//       {loading && <p className="text-blue-500 text-center">Loading pending orders...</p>}

//       <div>
//         <h2 className="text-xl font-semibold mb-4">List of Pending Orders</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr>
//               <th className="py-2 px-4 border-b">Order ID</th>
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
//                 {/* <th className="py-2 px-4 border-b">Source</th> */}
//                 <th className="py-2 px-4 border-b">Total Amount</th>
//                 <th className="py-2 px-4 border-b">Action</th>
                
//               </tr>
//             </thead>
//             <tbody>
//               {pendingOrders.length > 0 ? (
//                 pendingOrders.map((order) => {
//                   // Calculate Total Amount
//                   const totalAmount = order.products.reduce((sum, item) => {
//                     if (item.product && item.product.price) {
//                       const quantity = item.quantity ? item.quantity : 1;
//                       return sum + item.product.price * quantity;
//                     }
//                     return sum;
//                   }, 0);

//                   return (
//                     <tr key={order._id}>
//                       <td className="py-2 px-4 border-b">{order._id}</td>
//                       <td className="py-2 px-4 border-b">{order.user?.name || "N/A"}</td>
//                       <td className="py-2 px-4 border-b">{order.user?.email || "N/A"}</td>
//                       <td className="py-2 px-4 border-b">{order.user?.phoneNumber || "N/A"}</td>
//                       <td className="py-2 px-4 border-b">{order.user?.customerDetails?.firmName || 'N/A'}</td>
//                       <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
//                       <td className="py-2 px-4 border-b">{order.user?.customerDetails?.userCode || '(Miscellaneous)'}</td>
//                       <td className="py-2 px-4 border-b">{order.orderStatus}</td>
//                       <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
//                         {order.paymentStatus}
//                       </td>
//                       <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
//                       <td className="py-2 px-4 border-b">
//                         {order.products.map((item, index) => (
//                           <div key={index} className="mb-1">
//                             {item.product?.name || 'N/A'}: {item.quantity || 1}
//                           </div>
//                         ))}
//                       </td>
//                       {/* <td className="py-2 px-4 border-b">{order.orderSource || 'N/A'}</td> */}
//                       <td className="py-2 px-4 border-b">
//                         {typeof order.totalAmount === 'number'
//                           ? `₹${order.totalAmount.toFixed(2)}`
//                           : totalAmount > 0
//                           ? `₹${totalAmount.toFixed(2)}`
//                           : 'N/A'}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {order.orderStatus === 'pending' ? (
//                           <button
//                             onClick={() => setSelectedOrderId(order._id)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                           >
//                             Add Delivery Charge
//                           </button>
//                         ) : (
//                           <span className="text-gray-500">Cannot add charge</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border-b text-center" colSpan="12">
//                     No pending orders found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Delivery Charge Form */}
//       {selectedOrderId && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-4">Enter Delivery Charge</h2>
//           <div className="flex items-center space-x-4">
//             <input
//               type="number"
//               value={deliveryCharge}
//               onChange={(e) => setDeliveryCharge(e.target.value)}
//               className="border p-3 rounded-lg w-56 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter delivery charge"
//             />
//             <button
//               onClick={addDeliveryCharge}
//               className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
//             >
//               Add Charge
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryCharge;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';

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

// const DeliveryCharge = () => {
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [deliveryCharge, setDeliveryCharge] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('');
//   const modalRef = useRef(null);

//   // Fetch Pending Orders
//   const fetchPendingOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/reception/orders/pending");
//       console.log(response.data);
//       setPendingOrders(response.data.orders);
//     } catch (err) {
//       setError('Error fetching pending orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Add Delivery Charge
//   const addDeliveryCharge = async () => {
//     const charge = parseFloat(deliveryCharge);
//     if (!selectedOrderId || isNaN(charge) || charge <= 0) {
//       setError('Please enter a valid delivery charge greater than 0');
//       return;
//     }

//     try {
//       console.log('Sending payload:', { orderId: selectedOrderId, deliveryCharge: charge });
//       const response = await api.post("/reception/orders/add-delivery-charge", {
//         orderId: selectedOrderId,
//         deliveryCharge: charge,
//       });
//       setSuccessMessage(response.data.message);
//       setError('');
//       setDeliveryCharge('');
//       setSelectedOrderId(null);
//       fetchPendingOrders();
//     } catch (err) {
//       console.error('Error response:', err.response?.data);
//       setError(err.response?.data?.message || 'Error adding delivery charge');
//     }
//   };

//   // Get Payment Status Color
//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       paid: 'text-green-600',
//       pending: 'text-yellow-600',
//       failed: 'text-red-600',
//     };
//     return colors[status?.toLowerCase()] || 'text-gray-600';
//   };

//   // Close Modal on Escape Key
//   const handleKeyDown = useCallback((e) => {
//     if (e.key === 'Escape') {
//       setSelectedOrderId(null);
//       setDeliveryCharge('');
//       setError('');
//     }
//   }, []);

//   // Focus Modal on Open
//   useEffect(() => {
//     if (selectedOrderId && modalRef.current) {
//       modalRef.current.focus();
//     }
//   }, [selectedOrderId]);

//   useEffect(() => {
//     fetchPendingOrders();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Delivery Charges Management</h1>

//       {error && !selectedOrderId && (
//         <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg mb-4">{error}</p>
//       )}
//       {successMessage && (
//         <p className="text-green-500 text-center bg-green-100 p-3 rounded-lg mb-4">{successMessage}</p>
//       )}
//       {loading && (
//         <p className="text-blue-500 text-center bg-blue-100 p-3 rounded-lg mb-4">Loading pending orders...</p>
//       )}

//       <div>
//         <h2 className="text-2xl font-semibold mb-6 text-gray-700">List of Pending Orders</h2>
//         <div className="overflow-x-auto shadow-lg rounded-lg">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Order ID</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Customer Name</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Email</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Phone Number</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Firm Name</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Shipping Address</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">User Code</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Order Status</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Payment Status</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Payment Method</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Quantity</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total Amount</th>
//                 <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {pendingOrders.length > 0 ? (
//                 pendingOrders.map((order) => {
//                   const totalAmount = order.products.reduce((sum, item) => {
//                     if (item.product && item.product.price) {
//                       const quantity = item.quantity ? item.quantity : 1;
//                       return sum + item.product.price * quantity;
//                     }
//                     return sum;
//                   }, 0);

//                   return (
//                     <tr key={order._id} className="hover:bg-gray-50">
//                       <td className="py-3 px-4 text-sm text-gray-900">{order._id}</td>
//                       <td className="py-3 px-4 text-sm text-gray-900">{order.user?.name || 'N/A'}</td>
//                       <td className="py-3 px-4 text-sm text-gray-900">{order.user?.email || 'N/A'}</td>
//                       <td className="py-3 px-4 text-sm text-gray-900">{order.user?.phoneNumber || 'N/A'}</td>
//                       <td className="py-3 px-4 text-sm text-gray-900">
//                         {order.user?.customerDetails?.firmName || 'N/A'}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-900">
//                         {order.shippingAddress
//                           ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}`
//                           : 'N/A'}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-900">
//                         {order.user?.customerDetails?.userCode || '(Miscellaneous)'}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-900">{order.orderStatus}</td>
//                       <td
//                         className={`py-3 px-4 text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
//                       >
//                         {order.paymentStatus}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-900">{order.paymentMethod}</td>
//                       <td className="py-3 px-4 text-sm text-gray-900">
//                         {order.products.map((item, index) => (
//                           <div key={index} className="mb-1">
//                             {item.product?.name || 'N/A'}: {item.quantity || 1}
//                           </div>
//                         ))}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-gray-900">
//                         {typeof order.totalAmount === 'number'
//                           ? `₹${order.totalAmount.toFixed(2)}`
//                           : totalAmount > 0
//                           ? `₹${totalAmount.toFixed(2)}`
//                           : 'N/A'}
//                       </td>
//                       <td className="py-3 px-4 text-sm">
//                         {order.orderStatus === 'pending' ? (
//                           <button
//                             onClick={() => setSelectedOrderId(order._id)}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
//                           >
//                             Add Delivery Charge
//                           </button>
//                         ) : (
//                           <span className="text-gray-500">Cannot add charge</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="py-3 px-4 text-sm text-center text-gray-900" colSpan="12">
//                     No pending orders found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Delivery Charge Popup */}
//       {selectedOrderId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div
//             ref={modalRef}
//             tabIndex={-1}
//             onKeyDown={handleKeyDown}
//             className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300"
//           >
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Delivery Charge</h2>
//             {error && (
//               <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-sm">{error}</p>
//             )}
//             <div className="mb-4">
//               <label htmlFor="deliveryCharge" className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Charge (₹)
//               </label>
//               <input
//                 type="number"
//                 id="deliveryCharge"
//                 value={deliveryCharge}
//                 onChange={(e) => setDeliveryCharge(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 placeholder="Enter delivery charge"
//                 min="0"
//                 step="0.01"
//                 autoFocus
//               />
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setSelectedOrderId(null);
//                   setDeliveryCharge('');
//                   setError('');
//                 }}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addDeliveryCharge}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
//               >
//                 Add Charge
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryCharge;




import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

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

const DeliveryCharge = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  // Fetch Orders with Pending Payment Status
  const fetchOrdersWithPendingPayments = async () => {
    setLoading(true);
    try {
      // Try to fetch from the specific pending endpoint first
      const response = await api.get("/reception/orders/pending");
      const pendingOrders = response.data.orders || [];
      
      // If no orders found, try fetching from history and filter for pending payments
      if (pendingOrders.length === 0) {
        try {
          const historyResponse = await api.get("/reception/orders/history");
          const allOrders = historyResponse.data.orders || [];
          
          // Filter orders with pending payment status
          const ordersWithPendingPayments = allOrders.filter(order => 
            order.paymentStatus?.toLowerCase() === 'pending'
          );
          
          setPendingOrders(ordersWithPendingPayments);
        } catch (historyErr) {
          console.error('Error fetching from history:', historyErr);
          setPendingOrders([]);
        }
      } else {
        setPendingOrders(pendingOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error fetching orders with pending payments');
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Delivery Charge
  const addDeliveryCharge = async () => {
    const charge = parseFloat(deliveryCharge);
    if (!selectedOrderId || isNaN(charge) || charge < 0) {
      setError('Please enter a valid delivery charge greater than or equal to 0');
      return;
    }

    try {
      const response = await api.post("/reception/orders/add-delivery-charge", {
        orderId: selectedOrderId,
        deliveryCharge: charge,
      });
      setSuccessMessage(response.data.message);
      setError('');
      setDeliveryCharge('');
      setSelectedOrderId(null);
      fetchOrdersWithPendingPayments(); // Refresh the list
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error adding delivery charge';
      setError(errorMessage);
    }
  };

  // Get Payment Status Color
  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
    };
    return colors[status?.toLowerCase()] || 'text-gray-600';
  };

  // Close Modal on Escape Key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setSelectedOrderId(null);
      setDeliveryCharge('');
      setError('');
    }
  }, []);

  // Focus Modal on Open
  useEffect(() => {
    if (selectedOrderId && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedOrderId]);

  useEffect(() => {
    fetchOrdersWithPendingPayments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Delivery Charges Management</h1>

      {error && !selectedOrderId && (
        <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg mb-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-center bg-green-100 p-3 rounded-lg mb-4">{successMessage}</p>
      )}
      {loading && (
        <p className="text-blue-500 text-center bg-blue-100 p-3 rounded-lg mb-4">Loading orders with pending payments...</p>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Orders with Pending Payments</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Customer Name</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Email</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Phone Number</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Firm Name</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Shipping Address</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">User Code</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Order Status</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Payment Status</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Payment Method</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Quantity</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total Amount</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => {
                  const totalAmount = order.products.reduce((sum, item) => {
                    if (item.product && item.product.price) {
                      const quantity = item.quantity ? item.quantity : 1;
                      return sum + item.product.price * quantity;
                    }
                    return sum;
                  }, 0);

                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{order._id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.user?.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.user?.phoneNumber || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.user?.customerDetails?.firmName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.shippingAddress
                          ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.user?.customerDetails?.userCode || '(Miscellaneous)'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.orderStatus}</td>
                      <td
                        className={`py-3 px-4 text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{order.paymentMethod}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.product?.name || 'N/A'}: {item.quantity || 1}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {typeof order.totalAmountWithDelivery === 'number'
                          ? `₹${order.totalAmountWithDelivery.toFixed(2)}`
                          : typeof order.totalAmount === 'number'
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : totalAmount > 0
                          ? `₹${totalAmount.toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.orderStatus === 'pending' ? (
                          <button
                            onClick={() => setSelectedOrderId(order._id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                          >
                            Add Delivery Charge
                          </button>
                        ) : (
                          <span className="text-gray-500">Cannot add charge</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-3 px-4 text-sm text-center text-gray-900" colSpan="13">
                    No pending orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Charge Popup */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Delivery Charge</h2>
            {error && (
              <p className="text-red-500 bg-red-100 p-2 rounded-lg mb-4 text-sm">{error}</p>
            )}
            <div className="mb-4">
              <label htmlFor="deliveryCharge" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Charge (₹)
              </label>
              <input
                type="number"
                id="deliveryCharge"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Enter delivery charge"
                min="0"
                step="0.01"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedOrderId(null);
                  setDeliveryCharge('');
                  setError('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addDeliveryCharge}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Add Charge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryCharge;