import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL and request interceptor
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

const DeliveryCharge = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch Pending Orders
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reception/orders/pending");
      console.log(response.data); // Log the response to inspect the structure
      setPendingOrders(response.data.orders);
    } catch (err) {
      setError('Error fetching pending orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Delivery Charge
  const addDeliveryCharge = async () => {
    if (!selectedOrderId || deliveryCharge <= 0) {
      setError('Invalid order ID or delivery charge');
      return;
    }

    try {
      const response = await api.post("/reception/orders/add-delivery-charge", {
        orderId: selectedOrderId,
        deliveryCharge,
      });
      setSuccessMessage(response.data.message);
      setError('');
      setDeliveryCharge(0);
      setSelectedOrderId(null);
      fetchPendingOrders(); // Refresh the order list after adding the charge
    } catch (err) {
      setError('Error adding delivery charge');
    }
  };

  // Get Payment Status Color
  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'text-green-600',
      'pending': 'text-yellow-600',
      'failed': 'text-red-600'
    };
    return colors[status?.toLowerCase()] || 'text-gray-600';
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Delivery Charges Orders</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
      {loading && <p className="text-blue-500 text-center">Loading pending orders...</p>}

      <div>
        <h2 className="text-xl font-semibold mb-4">List of Pending Orders</h2>
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
                <th className="py-2 px-4 border-b">User Code</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                {/* <th className="py-2 px-4 border-b">Source</th> */}
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Action</th>
                
              </tr>
            </thead>
            <tbody>
              {pendingOrders.length > 0 ? (
                pendingOrders.map((order) => {
                  // Calculate Total Amount
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
                      <td className="py-2 px-4 border-b">{order.user?.name || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{order.user?.email || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{order.user?.phoneNumber || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{order.user?.customerDetails?.firmName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{order.shippingAddress}</td>
                      <td className="py-2 px-4 border-b">{order.user?.customerDetails?.userCode || '(Miscellaneous)'}</td>
                      <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                      <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </td>
                      <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                      <td className="py-2 px-4 border-b">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.product?.name || 'N/A'}: {item.quantity || 1}
                          </div>
                        ))}
                      </td>
                      {/* <td className="py-2 px-4 border-b">{order.orderSource || 'N/A'}</td> */}
                      <td className="py-2 px-4 border-b">
                        {typeof order.totalAmount === 'number'
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : totalAmount > 0
                          ? `₹${totalAmount.toFixed(2)}`
                          : 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.orderStatus === 'pending' ? (
                          <button
                            onClick={() => setSelectedOrderId(order._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                  <td className="py-2 px-4 border-b text-center" colSpan="12">
                    No pending orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Charge Form */}
      {selectedOrderId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Enter Delivery Charge</h2>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
              className="border p-3 rounded-lg w-56 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter delivery charge"
            />
            <button
              onClick={addDeliveryCharge}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
              Add Charge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryCharge;
