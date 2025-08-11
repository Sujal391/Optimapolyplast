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

const PendingPayments = () => {
  const [pendingPayments, setPendingPayments] = useState([]);

  const fetchPendingPayments = async () => {
    try {
      const response = await api.get("/dispatch/pending-payments");
      setPendingPayments(response.data?.pendingPayments || []);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      alert("Failed to fetch pending payments. Please try again.");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await api.get("/dispatch/pending-payments/download", {
        responseType: "blob", // Important for handling binary data
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pending_payments.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      alert("Failed to download Excel file. Please try again.");
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="max-w-9xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-700">Pending Payments</h1>
          <button
            onClick={handleDownloadExcel}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download Excel
          </button>
        </div>

        {pendingPayments.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Customer Info</th>
                  <th className="py-3 px-6 text-left">Shipping Address</th>
                  <th className="py-3 px-6 text-left">Products</th>
                  <th className="py-3 px-6 text-left">Total (₹)</th>
                  <th className="py-3 px-6 text-left">Delivery (₹)</th>
                  <th className="py-3 px-6 text-left">Grand Total (₹)</th>
                  <th className="py-3 px-6 text-left">Payment</th>
                  <th className="py-3 px-6 text-left">Order Status</th>
                  <th className="py-3 px-6 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pendingPayments.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {order.orderId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold">{order.user.name}</div>
                      <div className="text-gray-900 text-xs">
                        Firm: {order.user.firmName}
                      </div>
                      <div className="text-gray-900 text-xs">
                        User Code: {order.user.userCode}
                      </div>
                      <div className="text-gray-900 text-xs">
                        Phone: {order.user.phoneNumber}
                      </div>
                      <div className="text-gray-900 text-xs">
                        Email: {order.user.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {order.shippingAddress ? (
                        <div>
                          <div>{order.shippingAddress.address}</div>
                          <div>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state} -{" "}
                            {order.shippingAddress.pinCode}
                          </div>
                        </div>
                      ) : (
                        "No address provided"
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {order.products.map((product, idx) => (
                          <li key={idx}>
                            {product.productName} ({product.productType}) ×{" "}
                            {product.boxes} @ ₹{product.price}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      ₹{order.deliveryCharge.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 font-bold text-indigo-700">
                      ₹{order.totalAmountWithDelivery.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">{order.paymentMethod}</td>
                    <td className="py-4 px-6">{order.orderStatus}</td>
                    <td className="py-4 px-6 text-red-500 font-semibold">
                      {order.paymentStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-10">
            No pending payments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayments;
