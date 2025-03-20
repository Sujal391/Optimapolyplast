

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create an axios instance with a base URL and request interceptor
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

const OrderManagement = () => {
  // State for Order History
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');

  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'text-green-600',
      'pending': 'text-yellow-600',
      'failed': 'text-red-600'
    };
    return colors[status.toLowerCase()] || 'text-gray-600';
  };

  // Fetch Order History (orders from the last 35 days)
  const fetchOrderHistory = async () => {
    try {
      const response = await api.get("/reception/orders/history");
      setOrderHistory(response.data.orders);
    } catch (err) {
      setHistoryError('Error fetching order history');
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">Order Management</h1>

      {/* Order History Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Order History (Last 35 Days)</h2>
        {historyError && <p className="text-red-500">{historyError}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Firm Name</th>
                <th className="py-2 px-4 border-b">Shipping Address</th>
                {/* <th className="py-2 px-4 border-b">Email</th> */}
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
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => {
                  // Calculate the total amount by summing product prices * quantities
                  const totalAmount = order.products.reduce((sum, item) => {
                    if (item.product && item.product.price) {
                      const quantity = item.quantity ? item.quantity : 1;
                      return sum + item.product.price * quantity;
                    }
                    return sum;
                  }, 0);
                  
                  return (
                    <tr key={order._id}>
                      <td className="py-2 px-4 border-b">{order._id}</td>
                      <td className="py-2 px-4 border-b">{order.user.name}</td>
                      <td className="py-2 px-4 border-b">{order.user.email}</td>
                      <td className="py-2 px-4 border-b">{order.user.phoneNumber}</td>
                      <td className="py-2 px-4 border-b">{order.user.customerDetails?.firmName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
                      {/* <td className="py-3 px-4 text-gray-700">{customerDetails.email}</td> */}
                      {/* <td className="py-2 px-4 border-b">{order.user.customerDetails?.miscellaneous || 'N/A'}</td> */}
                      <td className="py-2 px-4 border-b">{order.user.customerDetails?.userCode || '(Miscellaneous)'}</td>
                      <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                      <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</td>
                      <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                      <td className="py-2 px-4 border-b">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.product?.name || 'N/A'}: {item.quantity || 1}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-4 border-b">{order.orderSource}</td>
                      <td className="py-2 px-4 border-b">
                        {typeof order.totalAmount === 'number'
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : totalAmount > 0
                          ? `₹${totalAmount.toFixed(2)}`
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="12">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
