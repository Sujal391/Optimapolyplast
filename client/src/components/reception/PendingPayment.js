import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { MoreVertical, X } from "lucide-react";
import Paginator from "../common/Paginator";

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
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      cookies.remove("token");
      try { window.location.href = "/"; } catch {}
    }
    return Promise.reject(err);
  }
);

const formatCurrency = (amount) =>
  typeof amount === "number" ? `₹${amount.toFixed(2)}` : "N/A";

const formatDateTime = (dateString) =>
  dateString ? new Date(dateString).toLocaleString("en-IN") : "N/A";

const getPaymentStatusColor = (status) => {
  const s = status?.toLowerCase();
  const colors = {
    pending: "text-yellow-600",
    completed: "text-green-600",
    failed: "text-red-600",
    submitted: "text-blue-600",
    verified: "text-green-700",
  };
  return colors[s] || "text-gray-600";
};

const toast = {
  success: (msg) => console.log("✓", msg),
  error: (msg) => console.error("✗", msg),
  warning: (msg) => console.warn("⚠", msg),
};

// Dropdown Menu Component
const DropdownMenu = ({ onViewDetails, onUpdateStatus, onAddCharge, disableAddCharge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
            <button
              onClick={() => {
                onViewDetails();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              View Details
            </button>
            <button
              onClick={() => {
                onUpdateStatus();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-t"
            >
              Update Status
            </button>
            <button
              onClick={() => {
                if (!disableAddCharge) {
                  onAddCharge();
                  setIsOpen(false);
                }
              }}
              disabled={disableAddCharge}
              className={`w-full text-left px-4 py-2 text-sm border-t ${
                disableAddCharge 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100 text-green-600'
              }`}
              title={disableAddCharge ? 'Delivery charges not applicable for this city' : ''}
            >
              Add Delivery Charge
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const PendingPayment = () => {
  // PENDING PAYMENTS STATE
  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");

  // VIEW DETAILS MODAL
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    payment: null,
  });

  // UPDATE PAYMENT STATUS MODAL
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    paymentId: null,
    currentStatus: "",
    remainingAmount: 0,
  });

  const [statusForm, setStatusForm] = useState({
    paymentStatus: "completed",
    receivedAmount: "",
    remarks: "",
  });

  // DELIVERY CHARGE MODAL STATE
  const [chargeModal, setChargeModal] = useState({
    isOpen: false,
    orderId: null,
    deliveryCharge: '',
    error: ''
  });

  // FETCH PENDING PAYMENTS
  const fetchPendingPayments = async () => {
    setPendingLoading(true);
    setPendingError("");
    try {
      const res = await api.get("reception/payments/pending");
      const data = res.data || {};
      setPendingPayments(data.pendingPayments || []);
      setPendingCount(data.count || (data.pendingPayments || []).length || 0);
    } catch (error) {
      console.error(error);
      setPendingError("Error fetching pending payments");
      toast.error("Error fetching pending payments");
    } finally {
      setPendingLoading(false);
    }
  };

  // DOWNLOAD PENDING PAYMENTS EXCEL
  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const res = await api.get("reception/payments/pending/download", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pending_payments.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Pending payments Excel downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Error downloading pending payments Excel");
    } finally {
      setDownloadingExcel(false);
    }
  };

  // ADD DELIVERY CHARGE FUNCTION
  const addDeliveryCharge = async () => {
    const charge = parseFloat(chargeModal.deliveryCharge);

    if (!chargeModal.orderId || isNaN(charge) || charge < 0) {
      setChargeModal(prev => ({
        ...prev,
        error: 'Please enter a valid delivery charge (₹).'
      }));
      return;
    }

    try {
      const res = await api.post("/reception/orders/add-delivery-charge", {
        orderId: chargeModal.orderId,
        deliveryCharge: charge,
      });

      toast.success(res.data?.message || "Delivery Charge Added!");
      fetchPendingPayments(); // reload data

      setChargeModal({ isOpen: false, orderId: null, deliveryCharge: "", error: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error adding delivery charge";
      setChargeModal(prev => ({ ...prev, error: errorMsg }));
    }
  };

  // OPEN DETAILS MODAL
  const openDetailsModal = (payment) => {
    setDetailsModal({
      isOpen: true,
      payment,
    });
  };

  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      payment: null,
    });
  };

  // OPEN STATUS MODAL
  const openStatusModal = (payment) => {
    setStatusModal({
      isOpen: true,
      paymentId: payment.paymentId,
      currentStatus: payment.paymentStatus || payment.status || "pending",
      remainingAmount: payment.remainingAmount || 0,
    });
    setStatusForm({
      paymentStatus: "completed",
      receivedAmount: payment.remainingAmount || "",
      remarks: "",
    });
  };

  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      paymentId: null,
      currentStatus: "",
      remainingAmount: 0,
    });
    setStatusForm({
      paymentStatus: "completed",
      receivedAmount: "",
      remarks: "",
    });
  };

  // DELIVERY CHARGE MODAL
  const openChargeModal = (payment) => {
    // Check if city is Ahmedabad or Gandhinagar (case-insensitive)
    const city = payment.shippingAddress?.city?.toLowerCase() || '';
    const restrictedCities = ['ahmedabad', 'gandhinagar'];
    
    if (restrictedCities.includes(city)) {
      toast.warning('Delivery charges cannot be added for Ahmedabad or Gandhinagar');
      return;
    }

    setChargeModal({
      isOpen: true,
      orderId: payment.orderId,
      deliveryCharge: payment.deliveryCharge || '',
      error: ''
    });
  };

  // SUBMIT STATUS UPDATE
  const handleUpdatePaymentStatus = async () => {
    const { paymentStatus, receivedAmount, remarks } = statusForm;
    const { paymentId, remainingAmount } = statusModal;

    if (!paymentStatus) {
      return toast.warning("Please select a payment status.");
    }

    const parsedAmount = parseFloat(receivedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return toast.warning("Please enter a valid received amount.");
    }

    if (remainingAmount && parsedAmount > remainingAmount) {
      return toast.warning("Received amount cannot be greater than remaining amount.");
    }

    try {
      const res = await api.patch(`reception/payments/${paymentId}/status`, {
        paymentStatus,
        receivedAmount: parsedAmount,
        remarks: remarks || undefined,
      });

      const updated = res.data?.payment;
      toast.success(res.data?.message || "Payment status updated successfully");

      if (updated) {
        setPendingPayments((prev) =>
          prev.map((p) =>
            p.paymentId === paymentId
              ? {
                  ...p,
                  paymentStatus: updated.paymentStatus || updated.status,
                  status: updated.status || updated.paymentStatus,
                  paidAmount: typeof updated.paidAmount === "number" ? updated.paidAmount : p.paidAmount,
                  remainingAmount: typeof updated.remainingAmount === "number" ? updated.remainingAmount : p.remainingAmount,
                  totalAmount: typeof updated.totalAmount === "number" ? updated.totalAmount : p.totalAmount,
                }
              : p
          )
        );
      } else {
        setPendingPayments((prev) =>
          prev.map((p) =>
            p.paymentId === paymentId ? { ...p, paymentStatus, status: paymentStatus } : p
          )
        );
      }

      closeStatusModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Error updating payment status"
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchPendingPayments();
  }, []);

  // FILTER FUNCTION
  const filterPendingPayments = (payments, searchTerm) => {
    if (!searchTerm.trim()) return payments;
    
    const term = searchTerm.toLowerCase();
    return payments.filter((payment) => {
      return (
        payment.paymentId?.toLowerCase().includes(term) ||
        payment.orderId?.toLowerCase().includes(term) ||
        payment.user?.name?.toLowerCase().includes(term) ||
        payment.user?.firmName?.toLowerCase().includes(term) ||
        payment.firmName?.toLowerCase().includes(term) ||
        payment.user?.userCode?.toLowerCase().includes(term) ||
        payment.user?.phoneNumber?.toLowerCase().includes(term) ||
        payment.user?.email?.toLowerCase().includes(term) ||
        payment.paymentStatus?.toLowerCase().includes(term) ||
        payment.status?.toLowerCase().includes(term) ||
        payment.orderStatus?.toLowerCase().includes(term)
      );
    });
  };

  // APPLY FILTERS AND PAGINATION
  const filteredPending = filterPendingPayments(pendingPayments, pendingSearchTerm);
  const pendingTotal = filteredPending.length;
  const pendingStartIdx = (pendingPage - 1) * pendingPageSize;
  const pendingEndIdx = pendingStartIdx + pendingPageSize;
  const pagedPending = filteredPending.slice(pendingStartIdx, pendingEndIdx);

  const formatShippingAddress = (address) =>
    address ? `${address.address || ''}, ${address.city || ''}, ${address.state || ''} ${address.pinCode || ''}` : 'N/A';

  return (
    <div className="bg-green-100 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Pending Payments</h1>

        {/* Search & Download */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            className="px-3 py-2 border rounded-lg w-full md:w-1/3"
            value={pendingSearchTerm}
            onChange={(e) => {
              setPendingSearchTerm(e.target.value);
              setPendingPage(1);
            }}
          />
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-60 whitespace-nowrap text-sm"
          >
            {downloadingExcel ? "Downloading..." : "Download Excel"}
          </button>
        </div>

        {pendingSearchTerm && (
          <div className="text-sm text-gray-600 mb-3">
            Found {pendingTotal} result{pendingTotal !== 1 ? 's' : ''}
          </div>
        )}

        {pendingLoading && <p>Loading pending payments...</p>}
        {pendingError && <div className="text-red-600 mb-2">{pendingError}</div>}

        {/* Table */}
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
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Delivery Charge</th>
                <th className="py-2 px-4 border-b">Paid</th>
                <th className="py-2 px-4 border-b">Total with Delivery</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pagedPending.length > 0 ? (
                pagedPending.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{payment.user?.userCode || '(Misc)'}</td>
                    <td className="py-2 px-4 border-b">{formatDateTime(payment.createdAt)}</td>
                    <td className="py-2 px-4 border-b">{payment.user?.name || "N/A"}</td>
                    <td className="py-2 px-4 border-b">{payment.user?.email || "N/A"}</td>
                    <td className="py-2 px-4 border-b">{payment.user?.phoneNumber || "N/A"}</td>
                    <td className="py-2 px-4 border-b">
                      {payment.user?.firmName || payment.firmName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b font-medium">
                      {formatCurrency(payment.totalAmount)}
                    </td>
                    <td className="py-2 px-4 border-b font-medium">
                      {formatCurrency(payment.deliveryCharge)}
                    </td>
                    <td className="py-2 px-4 border-b text-green-600 font-medium">
                      {formatCurrency(payment.paidAmount)}
                    </td>
                    <td className="py-2 px-4 border-b font-medium">
                      {formatCurrency(payment.totalAmountWithDelivery)}
                    </td>
                    <td className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(payment.paymentStatus || payment.status)}`}>
                      {payment.paymentStatus || payment.status || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">{payment.orderStatus || "N/A"}</td>
                    <td className="py-2 px-4 border-b">
                      <DropdownMenu
                        onViewDetails={() => openDetailsModal(payment)}
                        onUpdateStatus={() => openStatusModal(payment)}
                        onAddCharge={() => openChargeModal(payment)}
                        disableAddCharge={
                          ['ahmedabad', 'gandhinagar'].includes(
                            payment.shippingAddress?.city?.toLowerCase() || ''
                          )
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                !pendingLoading && (
                  <tr>
                    <td className="text-center py-8 text-sm text-gray-500" colSpan={13}>
                      No pending payments found.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {Math.min(pendingTotal, pendingStartIdx + 1)}–{Math.min(pendingTotal, pendingEndIdx)} of {pendingTotal}
          </span>
          <Paginator
            page={pendingPage}
            pageSize={pendingPageSize}
            total={pendingTotal}
            onPageChange={setPendingPage}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pendingPageSize}
            onChange={(e) => {
              setPendingPage(1);
              setPendingPageSize(parseInt(e.target.value, 10));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {detailsModal.isOpen && detailsModal.payment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full mx-4 rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <button onClick={closeDetailsModal} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <p><strong>Payment ID:</strong> {detailsModal.payment.paymentId}</p>
                <p><strong>Order ID:</strong> {detailsModal.payment.orderId || "N/A"}</p>
                <p><strong>Customer Name:</strong> {detailsModal.payment.user?.name || "N/A"}</p>
                <p><strong>Firm Name:</strong> {detailsModal.payment.user?.firmName || detailsModal.payment.firmName || "N/A"}</p>
                <p><strong>User Code:</strong> {detailsModal.payment.user?.userCode || "N/A"}</p>
                <p><strong>Phone:</strong> {detailsModal.payment.user?.phoneNumber || "N/A"}</p>
                <p><strong>Email:</strong> {detailsModal.payment.user?.email || "N/A"}</p>
                {detailsModal.payment.gstNumber && (
                  <p><strong>GST Number:</strong> {detailsModal.payment.gstNumber}</p>
                )}
                <p><strong>Created At:</strong> {formatDateTime(detailsModal.payment.createdAt)}</p>
                <p><strong>Shipping:</strong> {formatShippingAddress(detailsModal.payment.shippingAddress)}</p>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold mb-2">Payment Details</h3>
                <p><strong>Total Amount:</strong> {formatCurrency(detailsModal.payment.totalAmount)}</p>
                <p><strong>Paid Amount:</strong> <span className="text-green-600">{formatCurrency(detailsModal.payment.paidAmount)}</span></p>
                <p><strong>Delivery Charge:</strong> {formatCurrency(detailsModal.payment.deliveryCharge)}</p>
                <p><strong>Total with Delivery:</strong> {formatCurrency(detailsModal.payment.totalAmountWithDelivery)}</p>
                <p><strong>Payment Method:</strong> {detailsModal.payment.paymentMethod || "N/A"}</p>
                <p><strong>Payment Status:</strong> <span className={`font-medium ${getPaymentStatusColor(detailsModal.payment.paymentStatus || detailsModal.payment.status)}`}>{detailsModal.payment.paymentStatus || detailsModal.payment.status || "N/A"}</span></p>
                <p><strong>Order Status:</strong> {detailsModal.payment.orderStatus || "N/A"}</p>
              </div>

              {/* Products */}
              {detailsModal.payment.products?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Products</h3>
                  {detailsModal.payment.products.map((product, idx) => (
                    <div key={idx} className="text-sm border-b py-2">
                      <p>{product.productName} ({product.productType})</p>
                      <p>Quantity: {product.boxes} boxes @ {formatCurrency(product.price)} each</p>
                      {product.totalPrice && (
                        <p>Total: {formatCurrency(product.totalPrice)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right mt-4">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE PAYMENT STATUS MODAL */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Update Payment Status</h2>
            <p className="text-sm mb-2 text-gray-600">
              Current status: <span className="font-semibold">{statusModal.currentStatus || "pending"}</span>
            </p>
            <p className="text-sm mb-4 text-gray-600">
              Remaining amount: <span className="font-semibold">{formatCurrency(statusModal.remainingAmount)}</span>
            </p>

            <label className="block text-sm mb-1 font-medium">Payment Status</label>
            <select
              className="w-full p-2 border rounded mb-3 text-sm"
              value={statusForm.paymentStatus}
              onChange={(e) =>
                setStatusForm((prev) => ({ ...prev, paymentStatus: e.target.value }))
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <label className="block text-sm mb-1 font-medium">Received Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-3 text-sm"
              value={statusForm.receivedAmount}
              onChange={(e) =>
                setStatusForm((prev) => ({ ...prev, receivedAmount: e.target.value }))
              }
            />

            <label className="block text-sm mb-1 font-medium">Remarks</label>
            <textarea
              rows="3"
              className="w-full p-2 border rounded mb-4 text-sm"
              placeholder="Optional notes about this payment..."
              value={statusForm.remarks}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, remarks: e.target.value }))}
            />

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={closeStatusModal}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleUpdatePaymentStatus}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY CHARGE MODAL */}
      {chargeModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Delivery Charge</h2>
            <p className="text-sm mb-3 text-gray-600">
              Order ID: <span className="font-semibold">{chargeModal.orderId}</span>
            </p>

            <label className="block text-sm mb-1 font-medium">Delivery Charge (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full p-2 border rounded mb-3 text-sm"
              placeholder="Enter delivery charge amount"
              value={chargeModal.deliveryCharge}
              onChange={(e) =>
                setChargeModal((prev) => ({ 
                  ...prev, 
                  deliveryCharge: e.target.value,
                  error: '' 
                }))
              }
            />

            {chargeModal.error && (
              <div className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">
                {chargeModal.error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" 
                onClick={() => setChargeModal({ isOpen: false, orderId: null, deliveryCharge: '', error: '' })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={addDeliveryCharge}
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

export default PendingPayment;