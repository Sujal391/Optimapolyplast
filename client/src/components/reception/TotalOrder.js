

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import Paginator from '../common/Paginator';

// Create an axios instance with a base URL and request interceptor
const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auth expired or missing: clear token and redirect to login
      cookies.remove("token");
      try { window.location.href = "/"; } catch (_) {}
    }
    return Promise.reject(error);
  }
);

const OrderManagement = () => {
  // State for Order History
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [priceUpdateModal, setPriceUpdateModal] = useState({
    isOpen: false,
    details: [],
    orderId: null
  });

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'text-green-600',
      'pending': 'text-yellow-600',
      'failed': 'text-red-600'
    };
    return colors[status?.toLowerCase()] || 'text-gray-600';
  };

  // Format Shipping Address
  const formatShippingAddress = (address) => {
    if (!address || typeof address !== 'object') return 'N/A';
    const { address: street, city, state, pinCode } = address;
    return `${street || ''}, ${city || ''}, ${state || ''} ${pinCode || ''}`.trim();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return typeof amount === 'number' ? `₹${amount.toFixed(2)}` : 'N/A';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  // Close price update modal
  const closePriceUpdateModal = () => {
    setPriceUpdateModal({
      isOpen: false,
      details: [],
      orderId: null
    });
  };

  // Show price update details
  const showPriceUpdateDetails = (order) => {
    if (order.priceUpdated && order.priceUpdateHistory) {
      setPriceUpdateModal({
        isOpen: true,
        details: order.priceUpdateHistory,
        orderId: order._id
      });
    }
  };

  // Fetch Order History (orders from the last 35 days)
  const fetchOrderHistory = async () => {
    try {
      const response = await api.get("/reception/orders/history");
      const orders = response.data?.orders || [];
      setOrderHistory(Array.isArray(orders) ? orders : []);
      setHistoryError('');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error fetching order history';
      setHistoryError(msg);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // derived pagination
  const total = orderHistory.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedOrders = orderHistory.slice(startIdx, endIdx);

  return (
  <div  className="bg-green-100 min-h-screen">
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Order Management</h1>

      {/* Order History Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order History (Last 35 Days)</h2>
        {historyError && <p className="text-red-500">{historyError}</p>}
        <div className="overflow-x-auto shadow-xl rounded-xl">
          <table className="min-w-full bg-stone-100 border">
            <thead>
              <tr className="bg-gray-400">
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
                <th className="py-2 px-4 border-b">Products</th>
                <th className="py-2 px-4 border-b">Source</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Payment Details</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length > 0 ? (
                pagedOrders.map((order) => {
                  return (
                    <tr
                      key={order._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        order.priceUpdated ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                      }`}
                    >
                      <td className="py-2 px-4 border-b">
                        {order._id}
                        {order.priceUpdated && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⚠️ Updated
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{order.user?.name || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{order.user?.email || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{order.user?.phoneNumber || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{order.user?.customerDetails?.firmName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{formatShippingAddress(order.shippingAddress)}</td>
                      <td className="py-2 px-4 border-b">{order.user?.customerDetails?.userCode || '(Miscellaneous)'}</td>
                      <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                      <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </td>
                      <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                      <td className="py-2 px-4 border-b">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                            <div className="font-medium">{item.product?.name || 'N/A'}</div>
                            <div className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1} boxes
                            </div>
                            <div className="text-sm">
                              {item.originalPrice && item.originalPrice !== item.price ? (
                                <>
                                  <span className="line-through text-gray-500 mr-1">₹{item.originalPrice}</span>
                                  <span className="text-yellow-700 font-bold">₹{item.price}</span>
                                </>
                              ) : (
                                <span className="font-medium">₹{item.price}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.priceUpdated && (
                          <button
                            onClick={() => showPriceUpdateDetails(order)}
                            className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                            title={order.priceUpdateHistory && order.priceUpdateHistory.length > 0
                              ? order.priceUpdateHistory.map(
                                  h => `${h.product}: ₹${h.oldPrice} → ₹${h.newPrice} on ${formatDate(h.updatedAt)} by ${h.updatedBy}`
                                ).join('\n')
                              : 'Price updated'}
                          >
                            ⚠️ View Price Changes
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{order.orderSource || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">
                        <div>
                          <div className={`font-medium ${order.priceUpdated ? 'text-yellow-600' : ''}`}>
                            {formatCurrency(order.totalAmount)}
                          </div>
                          {order.deliveryCharge && (
                            <div className="text-sm text-gray-600">
                              Delivery: {formatCurrency(order.deliveryCharge)}
                            </div>
                          )}
                          {order.totalAmountWithDelivery && (
                            <div className="text-sm font-medium">
                              Total: {formatCurrency(order.totalAmountWithDelivery)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.paymentDetails && (
                          <div className="text-sm">
                            <div className="font-medium">Amount: {formatCurrency(order.paymentDetails.amount)}</div>
                            <div className="text-green-600">Paid: {formatCurrency(order.paymentDetails.paidAmount)}</div>
                            <div className={`font-medium ${order.priceUpdated ? 'text-yellow-600' : 'text-red-600'}`}>
                              Remaining: {formatCurrency(order.paymentDetails.remainingAmount)}
                            </div>
                            <div className="text-gray-600">Status: {order.paymentDetails.status}</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="15">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* pagination controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing {Math.min(total, startIdx + 1)}–{Math.min(total, endIdx)} of {total}
          </div>
          <Paginator page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
          >
            {[5,10,20,50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Update Modal */}
      {priceUpdateModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">⚠️ Price Update History</h3>
              <button
                onClick={closePriceUpdateModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                Price update history for Order ID: <strong>{priceUpdateModal.orderId}</strong>
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {priceUpdateModal.details.map((detail, index) => (
                <div key={index} className="border border-yellow-200 bg-yellow-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Product ID: {detail.product}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(detail.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-red-600">Price changed from ₹{detail.oldPrice} to ₹{detail.newPrice}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Updated by: {detail.updatedBy}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The order and payment amounts have been automatically updated to reflect the new prices.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closePriceUpdateModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default OrderManagement;