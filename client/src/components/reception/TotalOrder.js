import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import Paginator from '../common/Paginator';

// Axios instance
const api = axios.create({ baseURL: process.env.REACT_APP_API });

api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      cookies.remove("token");
      try { window.location.href = "/"; } catch {}
    }
    return Promise.reject(err);
  }
);

// COMPONENT STARTS
export default function OrderManagement() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');

  // Search
  const [search, setSearch] = useState("");

  // Modals
  const [priceUpdateModal, setPriceUpdateModal] = useState({
    isOpen: false, details: [], orderId: null
  });
  const [detailModal, setDetailModal] = useState({
    isOpen: false, order: null,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const formatDate = (d) => new Date(d).toLocaleString('en-IN');
  const formatCurrency = (amt) => amt ? `₹${amt.toFixed(2)}` : 'N/A';
  const formatShippingAddress = (address) =>
    address ? `${address.address || ''}, ${address.city || ''}, ${address.state || ''} ${address.pinCode || ''}` : 'N/A';

  const getPaymentStatusColor = (status) => {
    const colors = { paid: 'text-green-600', pending: 'text-yellow-600', failed: 'text-red-600' };
    return colors[status?.toLowerCase()] || 'text-gray-600';
  };

  const fetchOrderHistory = async () => {
    try {
      const res = await api.get("/reception/orders/history");
      setOrderHistory(res.data?.orders || []);
      setHistoryError("");
    } catch (err) {
      setHistoryError(err.response?.data?.message || "Error fetching orders");
    }
  };

  useEffect(() => { fetchOrderHistory(); }, []);

  // 👉 Filter Orders based on search
  const filteredOrders = orderHistory.filter((o) => {
    const query = search.toLowerCase();
    return (
      o._id?.toLowerCase().includes(query) ||
      o.user?.name?.toLowerCase().includes(query) ||
      o.user?.phoneNumber?.toLowerCase().includes(query) ||
      o.user?.customerDetails?.firmName?.toLowerCase().includes(query)
    );
  });

  // Pagination Logic
  const total = filteredOrders.length;
  const startIdx = (page - 1) * pageSize;
  const pagedOrders = filteredOrders.slice(startIdx, startIdx + pageSize);

  return (
    <div className="bg-green-100 min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6">Order History</h1>

        {/* 🔍 Search Box */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg w-full md:w-1/3"
          />
        </div>

        {historyError && <p className="text-red-500">{historyError}</p>}

        {/* Responsive Table */}
        <div className="overflow-x-auto shadow-xl rounded-xl">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-400 text-sm">
                <th className="py-2 px-4 border-b">User Code</th>
                <th className="py-2 px-4 border-b">Date & Time</th>
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Firm</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length ? pagedOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{o.user?.customerDetails?.userCode || '(Misc)'}</td>
                  <td className="py-2 px-4 border-b">{formatDate(o.createdAt)}</td>
                  <td className="py-2 px-4 border-b">{o.user?.name || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{o.user?.email || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{o.user?.phoneNumber || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{o.user?.customerDetails?.firmName || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{o.orderStatus}</td>
                  <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(o.paymentStatus)}`}>
                    {o.paymentStatus}
                  </td>
                  <td className="py-2 px-4 border-b">{o.paymentMethod}</td>
                  <td className="py-2 px-4 border-b">{formatCurrency(o.totalAmount)}</td>

                  {/* 👉 Actions Button (View Details) */}
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => setDetailModal({ isOpen: true, order: o })}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10" className="py-3 text-center">No results found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {Math.min(total, startIdx + 1)}–{Math.min(total, startIdx + pageSize)} of {total}
          </span>
          <Paginator page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      {/* 📌 DETAILS MODAL */}
{detailModal.isOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white max-w-2xl w-full mx-4 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>
      
      <p><strong>Order ID:</strong> {detailModal.order._id}</p>
      <p><strong>Source:</strong> {detailModal.order.orderSource || 'N/A'}</p>
      <p><strong>Shipping:</strong> {formatShippingAddress(detailModal.order.shippingAddress)}</p>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Products:</h3>
        {detailModal.order.products.map((p, i) => (
          <div key={i} className="text-sm border-b py-2">
            <p>{p.product?.name} - ₹{p.price} per box</p>
            <p>Quantity: {p.boxes} boxes</p>
          </div>
        ))}
      </div>

      {/* 🧾 PRICE UPDATE BUTTON (ONLY IF UPDATED) */}
      {detailModal.order.priceUpdated && (
        <button
          onClick={() => setPriceUpdateModal({
            isOpen: true,
            details: detailModal.order.priceUpdateHistory,
            orderId: detailModal.order._id
          })}
          className="mt-3 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
        >
          ⚠ View Price Changes
        </button>
      )}

      <div className="text-right mt-4">
        <button
          onClick={() => setDetailModal({ isOpen: false, order: null })}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* 📌 PRICE UPDATE HISTORY MODAL */}
{priceUpdateModal.isOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-red-600">⚠️ Price Update History</h3>
        <button
          onClick={() => setPriceUpdateModal({ isOpen: false, details: [], orderId: null })}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <p className="text-gray-700 mb-2">
        Price update history for <strong>Order: {priceUpdateModal.orderId}</strong>
      </p>

      <div className="space-y-3 mb-4">
        {priceUpdateModal.details.map((detail, index) => (
          <div key={index} className="border border-yellow-200 bg-yellow-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium">Product ID: {detail.product}</span>
              <span className="text-sm text-gray-500">{formatDate(detail.updatedAt)}</span>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-red-600">₹{detail.oldPrice} → ₹{detail.newPrice}</span>
            </div>
            <div className="mt-1 text-xs text-gray-600">Updated by: {detail.updatedBy}</div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Order amounts are automatically updated based on price changes.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setPriceUpdateModal({ isOpen: false, details: [], orderId: null })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
