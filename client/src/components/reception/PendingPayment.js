import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import Paginator from '../common/Paginator';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
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

const PendingPayment = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceUpdateModal, setPriceUpdateModal] = useState({
    isOpen: false,
    details: [],
    paymentId: null
  });

  // pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  // Fetch Pending Payments
  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reception/pending-payments");
      console.log('Pending payments response:', response.data);
      setPendingPayments(response.data.pendingPayments || []);
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      setError('Error fetching pending payments');
    } finally {
      setLoading(false);
    }
  };

  // Close price update modal
  const closePriceUpdateModal = () => {
    setPriceUpdateModal({
      isOpen: false,
      details: [],
      paymentId: null
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return typeof amount === 'number' ? `₹${amount.toFixed(2)}` : 'N/A';
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN');
  };

  // Check if payment has price updates
  const hasPriceUpdates = (payment) => {
    return payment.priceUpdated || false;
  };

  // Show price update details
  const showPriceUpdateDetails = (payment) => {
    if (payment.priceUpdated && payment.priceUpdateHistory) {
      setPriceUpdateModal({
        isOpen: true,
        details: payment.priceUpdateHistory,
        paymentId: payment.paymentId
      });
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    const colors = {
      'paid': 'text-green-600',
      'pending': 'text-yellow-600',
      'failed': 'text-red-600',
      'partial': 'text-orange-600'
    };
    return colors[status?.toLowerCase()] || 'text-gray-600';
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  // derived pagination
  const total = pendingPayments.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedPayments = pendingPayments.slice(startIdx, endIdx);

  return (
  <div className="min-h-screen bg-green-100">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Pending Payments</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <p className="bg-blue-100 border border-blue-400 text-blue-700 text-center px-4 py-3 rounded mb-4">
          Loading pending payments...
        </p>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">List of Pending Payments</h2>
          <div className="text-sm text-gray-600">
            Total: {pendingPayments.length} payments
          </div>
        </div>

        <div className="overflow-x-auto shadow-xl rounded-xl">
          <table className="min-w-full bg-stone-100 border">
            <thead className=" text-black">
              <tr className="bg-gray-400">
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Payment ID</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Customer Info</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Products</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total Amount</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Paid Amount</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Remaining Amount</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Delivery Charge</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Total with Delivery</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pagedPayments.length > 0 ? (
                pagedPayments.map((payment) => (
                  <tr
                    key={payment.paymentId}
                    className={`hover:bg-gray-50 transition-colors ${
                      hasPriceUpdates(payment) ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {payment.paymentId}
                      {hasPriceUpdates(payment) && (
                        <span
                          className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                          onClick={() => showPriceUpdateDetails(payment)}
                        >
                          ⚠️ Updated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{payment.orderId}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{payment.user?.name || 'N/A'}</div>
                        <div className="text-gray-500">{payment.user?.firmName || 'N/A'}</div>
                        <div className="text-gray-500">{payment.user?.userCode || 'N/A'}</div>
                        <div className="text-gray-500">{payment.user?.phoneNumber || 'N/A'}</div>
                        <div className="text-gray-500">{payment.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {payment.products?.map((product, index) => (
                        <div key={index} className="mb-1">
                          <div className="font-medium">{product.productName}</div>
                          <div className="text-gray-500">
                            {product.productType} - {product.boxes} boxes @ ₹{product.price}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <span className={`font-medium ${hasPriceUpdates(payment) ? 'text-yellow-600' : ''}`}>
                        {formatCurrency(payment.totalAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <span className="font-medium text-green-600">
                        {formatCurrency(payment.paidAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <span className={`font-medium ${hasPriceUpdates(payment) ? 'text-yellow-600' : 'text-red-600'}`}>
                        {formatCurrency(payment.remainingAmount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {formatCurrency(payment.deliveryCharge)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      <span className={`font-medium ${hasPriceUpdates(payment) ? 'text-yellow-600' : ''}`}>
                        {formatCurrency(payment.totalAmountWithDelivery)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-4 text-sm text-center text-gray-500" colSpan="10">
                    No pending payments found.
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
              <h3 className="text-xl font-bold text-red-600">⚠️ Price Update Alert</h3>
              <button
                onClick={closePriceUpdateModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                The following payment amounts have been updated for Payment ID: <strong>{priceUpdateModal.paymentId}</strong>
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {priceUpdateModal.details.map((detail, index) => (
                <div key={index} className="border border-yellow-200 bg-yellow-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Product: {detail.product?.name || detail.product || 'Unknown Product'}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(detail.updatedAt)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-red-600">Price increased from ₹{detail.oldPrice} to ₹{detail.newPrice}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Updated by: {detail.updatedBy || 'System'}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The payment amounts have been automatically updated to reflect the new prices.
                The customer will be charged the updated amount.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closePriceUpdateModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default PendingPayment;