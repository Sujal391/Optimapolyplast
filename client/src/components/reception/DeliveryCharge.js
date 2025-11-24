import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { MoreVertical, X } from "lucide-react";

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

const formatCurrency = (amount) =>
  typeof amount === "number" ? `₹${amount.toFixed(2)}` : "N/A";

const formatDateTime = (dateString) =>
  dateString ? new Date(dateString).toLocaleString("en-IN") : "N/A";

const getPaymentStatusColor = (status) => {
  const s = status?.toLowerCase();
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    submitted: "bg-blue-100 text-blue-800",
    verified: "bg-green-100 text-green-900",
  };
  return colors[s] || "bg-gray-100 text-gray-800";
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

// Paginator Component
const Paginator = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-3 py-1">
        Page {page} of {totalPages || 1}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || totalPages === 0}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const PendingPayment = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // PENDING PAYMENTS STATE
  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");

  // SUBMITTED PAYMENTS STATE
  const [submittedPayments, setSubmittedPayments] = useState([]);
  const [submittedLoading, setSubmittedLoading] = useState(false);
  const [submittedError, setSubmittedError] = useState("");
  const [submittedPage, setSubmittedPage] = useState(1);
  const [submittedPageSize, setSubmittedPageSize] = useState(10);

  // VIEW DETAILS MODAL
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    payment: null,
    type: null, // 'pending' or 'submitted'
  });

  // UPDATE PAYMENT STATUS MODAL (for pending payments)
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

  // DELIVERY CHARGE MODAL STATE (ADD BELOW OTHER useState HOOKS)
  const [chargeModal, setChargeModal] = useState({
    isOpen: false,
    orderId: null,
    deliveryCharge: '',
    error: ''
  });

  // VERIFY PAYMENT MODAL (for submitted payments)
  const [verifyModal, setVerifyModal] = useState({
    isOpen: false,
    paymentId: null,
    suggestedAmount: 0,
  });

  const [verifyForm, setVerifyForm] = useState({
    verifiedAmount: "",
    verificationNotes: "",
    status: "verified",
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

  // FETCH SUBMITTED PAYMENTS
  const fetchSubmittedPayments = async () => {
    setSubmittedLoading(true);
    setSubmittedError("");
    try {
      const res = await api.get("reception/payments/submitted");
      const data = res.data || {};
      setSubmittedPayments(data.payments || []);
    } catch (error) {
      console.error(error);
      setSubmittedError("Error fetching submitted payments");
      toast.error("Error fetching submitted payments");
    } finally {
      setSubmittedLoading(false);
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
  const openDetailsModal = (payment, type) => {
    setDetailsModal({
      isOpen: true,
      payment,
      type,
    });
  };

  const closeDetailsModal = () => {
    setDetailsModal({
      isOpen: false,
      payment: null,
      type: null,
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

  // OPEN VERIFY MODAL
  const openVerifyModal = (payment) => {
    const lastHistory =
      payment.paymentHistory?.length > 0
        ? payment.paymentHistory[payment.paymentHistory.length - 1]
        : null;

    const suggestedAmount =
      lastHistory?.submittedAmount ||
      payment.amount ||
      payment.remainingAmount ||
      0;

    setVerifyModal({
      isOpen: true,
      paymentId: payment._id || payment.paymentId,
      suggestedAmount,
    });

    setVerifyForm({
      verifiedAmount: suggestedAmount,
      verificationNotes: "",
      status: "verified",
    });
  };

  const closeVerifyModal = () => {
    setVerifyModal({
      isOpen: false,
      paymentId: null,
      suggestedAmount: 0,
    });
    setVerifyForm({
      verifiedAmount: "",
      verificationNotes: "",
      status: "verified",
    });
  };

  // SUBMIT VERIFY PAYMENT
  const handleVerifyPayment = async () => {
    const { verifiedAmount, verificationNotes, status } = verifyForm;
    const { paymentId } = verifyModal;

    const parsedAmount = parseFloat(verifiedAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return toast.warning("Please enter a valid verified amount.");
    }

    try {
      const res = await api.patch(`reception/payments/${paymentId}/verify`, {
        verifiedAmount: parsedAmount,
        verificationNotes: verificationNotes || undefined,
        status: status || undefined,
      });

      const updated = res.data?.payment;
      toast.success(res.data?.message || "Payment verified successfully");

      if (updated) {
        setSubmittedPayments((prev) =>
          prev.map((p) =>
            (p._id || p.paymentId) === (updated.paymentId || paymentId)
              ? {
                  ...p,
                  status: updated.status || "completed",
                  paidAmount: typeof updated.paidAmount === "number" ? updated.paidAmount : p.paidAmount,
                  remainingAmount: typeof updated.remainingAmount === "number" ? updated.remainingAmount : p.remainingAmount,
                  verifiedAmount: typeof updated.verifiedAmount === "number" ? updated.verifiedAmount : p.verifiedAmount,
                }
              : p
          )
        );
      }

      closeVerifyModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Error verifying payment"
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchPendingPayments();
  }, []);

  // FILTER FUNCTIONS
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

const filterSubmittedPayments = (payments, searchTerm) => {
  if (!searchTerm.trim()) return payments;
  
  const term = searchTerm.toLowerCase();
  return payments.filter((payment) => {
    return (
      payment._id?.toLowerCase().includes(term) ||
      payment.paymentId?.toLowerCase().includes(term) ||
      payment.user?.name?.toLowerCase().includes(term) ||
      payment.user?.customerDetails?.firmName?.toLowerCase().includes(term) ||
      payment.user?.customerDetails?.userCode?.toLowerCase().includes(term) ||
      payment.user?.phoneNumber?.toLowerCase().includes(term) ||
      payment.user?.email?.toLowerCase().includes(term) ||
      payment.status?.toLowerCase().includes(term) ||
      payment.orderDetails?.orderStatus?.toLowerCase().includes(term)
    );
  });
};

  // LOAD SUBMITTED WHEN TAB FIRST OPENED
  useEffect(() => {
    if (activeTab === "submitted" && submittedPayments.length === 0) {
      fetchSubmittedPayments();
    }
  }, [activeTab, submittedPayments.length]);

  // APPLY FILTERS AND PAGINATION
  const filteredPending = filterPendingPayments(pendingPayments, pendingSearchTerm);
  const pendingTotal = filteredPending.length;
  const pendingStartIdx = (pendingPage - 1) * pendingPageSize;
  const pendingEndIdx = pendingStartIdx + pendingPageSize;
  const pagedPending = filteredPending.slice(pendingStartIdx, pendingEndIdx);

  const filteredSubmitted = filterSubmittedPayments(submittedPayments, submittedSearchTerm);
  const submittedTotal = filteredSubmitted.length;
  const submittedStartIdx = (submittedPage - 1) * submittedPageSize;
  const submittedEndIdx = submittedStartIdx + submittedPageSize;
  const pagedSubmitted = filteredSubmitted.slice(submittedStartIdx, submittedEndIdx);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto p-4 max-w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Payment Management</h1>

        {/* TABS */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "pending"
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Payments{pendingCount ? ` (${pendingCount})` : ""}
          </button>
          <button
            className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "submitted"
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            Submitted Payments{submittedTotal ? ` (${submittedTotal})` : ""}
          </button>
        </div>

        {/* PENDING PAYMENTS TAB */}
        {activeTab === "pending" && (
          <>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Pending Payments</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                    value={pendingSearchTerm}
                    onChange={(e) => {
                      setPendingSearchTerm(e.target.value);
                      setPendingPage(1);
                    }}
                  />
                  <button
                    onClick={handleDownloadExcel}
                    disabled={downloadingExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {downloadingExcel ? "Downloading..." : "Download Excel"}
                  </button>
                </div>
              </div>
              {pendingSearchTerm && (
                <div className="text-sm text-gray-600">
                  Found {pendingTotal} result{pendingTotal !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {pendingLoading && <p>Loading pending payments...</p>}
            {pendingError && <div className="text-red-600 mb-2">{pendingError}</div>}

            <div className="overflow-x-auto shadow-xl rounded-xl">
              <table className="w-full bg-white border">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Customer Name",
                      "Firm Name",
                      "User Code",
                      "Contact",
                      "Total Amount",
                      "Delivery Charge",
                      "Paid",
                      "Total Amount with Delivery",
                      "Payment Status",
                      "Order Status",
                      "Created At",
                      "Action",
                    ].map((th) => (
                      <th
                        key={th}
                        className="py-3 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pagedPending.length > 0 ? (
                    pagedPending.map((payment) => (
                      <tr key={payment.paymentId} className="hover:bg-gray-50 border-b">
                        <td className="py-3 px-4 text-sm">{payment.user?.name || "N/A"}</td>
                        <td className="py-3 px-4 text-sm">
                          {payment.user?.firmName || payment.firmName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm">{payment.user?.userCode || "N/A"}</td>
                        <td className="py-3 px-4 text-sm">
                          <div>{payment.user?.phoneNumber || "N/A"}</div>
                          <div className="text-xs text-gray-500">{payment.user?.email || "—"}</div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(payment.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(payment.deliveryCharge)}
                        </td>
                        <td className="py-3 px-4 text-sm text-green-600 font-medium">
                          {formatCurrency(payment.paidAmount)}
                        </td>
                        {/* <td className="py-3 px-4 text-sm text-red-600 font-medium">
                          {formatCurrency(payment.remainingAmount)}
                        </td> */}
                        <td className="py-3 px-4 text-sm font-medium">
                          {formatCurrency(payment.totalAmountWithDelivery)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              payment.paymentStatus || payment.status
                            )}`}
                          >
                            {payment.paymentStatus || payment.status || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{payment.orderStatus || "N/A"}</td>
                        <td className="py-3 px-4 text-sm whitespace-nowrap">
                          {formatDateTime(payment.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu
                            onViewDetails={() => openDetailsModal(payment, "pending")}
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
                        <td className="text-center py-8 text-sm text-gray-500" colSpan={11}>
                          No pending payments found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - PENDING */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm">
                Showing {pendingTotal === 0 ? 0 : pendingStartIdx + 1}–
                {Math.min(pendingEndIdx, pendingTotal)} of {pendingTotal}
              </div>
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
          </>
        )}

        {/* SUBMITTED PAYMENTS TAB */}
        {activeTab === "submitted" && (
          <>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Submitted Payments</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search payments..."
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                    value={submittedSearchTerm}
                    onChange={(e) => {
                      setSubmittedSearchTerm(e.target.value);
                      setSubmittedPage(1);
                    }}
                  />
                  <button
                    onClick={fetchSubmittedPayments}
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 whitespace-nowrap"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              {submittedSearchTerm && (
                <div className="text-sm text-gray-600">
                  Found {submittedTotal} result{submittedTotal !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {submittedLoading && <p>Loading submitted payments...</p>}
            {submittedError && <div className="text-red-600 mb-2">{submittedError}</div>}

            <div className="overflow-x-auto shadow-xl rounded-xl">
              <table className="w-full bg-white border">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Customer Name",
                      "Firm Name",
                      "User Code",
                      "Contact",
                      "Amount",
                      "Paid",
                      "Remaining",
                      "Status",
                      "Last Submission",
                      "Order Status",
                      "Action",
                    ].map((th) => (
                      <th
                        key={th}
                        className="py-3 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedSubmitted.length > 0 ? (
                    pagedSubmitted.map((payment) => {
                      const lastHistory =
                        payment.paymentHistory?.length > 0
                          ? payment.paymentHistory[payment.paymentHistory.length - 1]
                          : null;
                      return (
                        <tr
                          key={payment._id || payment.paymentId}
                          className="hover:bg-gray-50 border-b"
                        >
                          <td className="py-3 px-4 text-sm">{payment.user?.name || "N/A"}</td>
                          <td className="py-3 px-4 text-sm">
                            {payment.user?.customerDetails?.firmName || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {payment.user?.customerDetails?.userCode || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div>{payment.user?.phoneNumber || "N/A"}</div>
                            <div className="text-xs text-gray-500">{payment.user?.email || "—"}</div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-green-600 font-medium">
                            {formatCurrency(payment.paidAmount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-red-600 font-medium">
                            {formatCurrency(payment.remainingAmount)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {lastHistory ? (
                              <div className="text-xs">
                                <div>Ref: {lastHistory.referenceId || "—"}</div>
                                <div>Amt: {formatCurrency(lastHistory.submittedAmount)}</div>
                                <div>On: {formatDateTime(lastHistory.submissionDate)}</div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No history</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {payment.orderDetails?.orderStatus || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu
                              onViewDetails={() => openDetailsModal(payment, "submitted")}
                              onUpdateStatus={() => openVerifyModal(payment)}
                              onAddCharge={() => {}}
                              disableAddCharge={true}
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    !submittedLoading && (
                      <tr>
                        <td className="text-center py-8 text-sm text-gray-500" colSpan={11}>
                          No submitted payments found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - SUBMITTED */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm">
                Showing {submittedTotal === 0 ? 0 : submittedStartIdx + 1}–
                {Math.min(submittedEndIdx, submittedTotal)} of {submittedTotal}
              </div>
              <Paginator
                page={submittedPage}
                pageSize={submittedPageSize}
                total={submittedTotal}
                onPageChange={setSubmittedPage}
              />
              <select
                className="border rounded px-2 py-1 text-sm"
                value={submittedPageSize}
                onChange={(e) => {
                  setSubmittedPage(1);
                  setSubmittedPageSize(parseInt(e.target.value, 10));
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* VIEW DETAILS MODAL */}
      {detailsModal.isOpen && detailsModal.payment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <button onClick={closeDetailsModal} className="p-1 hover:bg-gray-100 rounded">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Payment ID:</span>
                    <p className="text-sm">{detailsModal.payment.paymentId || detailsModal.payment._id}</p>
                  </div>
                  {detailsModal.type === "pending" && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Order ID:</span>
                      <p className="text-sm">{detailsModal.payment.orderId || "N/A"}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Customer Name:</span>
                    <p className="text-sm">{detailsModal.payment.user?.name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Firm Name:</span>
                    <p className="text-sm">
                      {detailsModal.type === "pending"
                        ? detailsModal.payment.user?.firmName || detailsModal.payment.firmName || "N/A"
                        : detailsModal.payment.user?.customerDetails?.firmName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">User Code:</span>
                    <p className="text-sm">
                      {detailsModal.type === "pending"
                        ? detailsModal.payment.user?.userCode || "N/A"
                        : detailsModal.payment.user?.customerDetails?.userCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-sm">{detailsModal.payment.user?.phoneNumber || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-sm">{detailsModal.payment.user?.email || "N/A"}</p>
                  </div>
                  {detailsModal.type === "pending" && detailsModal.payment.gstNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">GST Number:</span>
                      <p className="text-sm">{detailsModal.payment.gstNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Created At:</span>
                    <p className="text-sm">{formatDateTime(detailsModal.payment.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                    <p className="text-sm font-semibold">
                      {formatCurrency(detailsModal.payment.totalAmount || detailsModal.payment.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Paid Amount:</span>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(detailsModal.payment.paidAmount)}
                    </p>
                  </div>
                  {/* <div>
                    <span className="text-sm font-medium text-gray-600">Remaining Amount:</span>
                    <p className="text-sm font-semibold text-red-600">
                      {formatCurrency(detailsModal.payment.remainingAmount)}
                    </p>
                  </div> */}
                  {detailsModal.type === "pending" && (
                    <>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Delivery Charge:</span>
                        <p className="text-sm">{formatCurrency(detailsModal.payment.deliveryCharge)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Total with Delivery:</span>
                        <p className="text-sm font-semibold">
                          {formatCurrency(detailsModal.payment.totalAmountWithDelivery)}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                    <p className="text-sm">
                      {detailsModal.type === "pending"
                        ? detailsModal.payment.paymentMethod || "N/A"
                        : detailsModal.payment.orderDetails?.paymentMethod || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Payment Status:</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getPaymentStatusColor(
                        detailsModal.payment.paymentStatus || detailsModal.payment.status
                      )}`}
                    >
                      {detailsModal.payment.paymentStatus || detailsModal.payment.status || "N/A"}
                    </span>
                  </div>
                  {/* <div>
                    <span className="text-sm font-medium text-gray-600">Order Status:</span>
                    <p className="text-sm">
                      {detailsModal.type === "pending"
                        ? detailsModal.payment.orderStatus || "N/A"
                        : detailsModal.payment.orderDetails?.orderStatus || "N/A"}
                    </p>
                  </div> */}
                </div>
              </div>

              {/* Products */}
              {detailsModal.type === "pending" && detailsModal.payment.products?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Products</h3>
                  <div className="space-y-3">
                    {detailsModal.payment.products.map((product, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium text-sm mb-1">
                          {product.productName} ({product.productType})
                        </div>
                        <div className="text-sm text-gray-600">
                          Quantity: {product.boxes} boxes @ {formatCurrency(product.price)} each
                        </div>
                        {product.totalPrice && (
                          <div className="text-sm text-gray-600">
                            Total: {formatCurrency(product.totalPrice)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment History for Submitted Payments */}
              {detailsModal.type === "submitted" && detailsModal.payment.paymentHistory?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment History</h3>
                  <div className="space-y-3">
                    {detailsModal.payment.paymentHistory.map((history, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Reference ID:</span>{" "}
                            {history.referenceId || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Submitted Amount:</span>{" "}
                            {formatCurrency(history.submittedAmount)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Submission Date:</span>{" "}
                            {formatDateTime(history.submissionDate)}
                          </div>
                          {history.notes && (
                            <div className="col-span-2">
                              <span className="font-medium text-gray-600">Notes:</span> {history.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
              <button
                onClick={closeDetailsModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE PAYMENT STATUS MODAL */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
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

      {/* VERIFY PAYMENT MODAL */}
      {verifyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Verify Payment</h2>
            <p className="text-sm mb-3 text-gray-600">
              Suggested verified amount:{" "}
              <span className="font-semibold">{formatCurrency(verifyModal.suggestedAmount)}</span>
            </p>

            <label className="block text-sm mb-1 font-medium">Verified Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-3 text-sm"
              value={verifyForm.verifiedAmount}
              onChange={(e) =>
                setVerifyForm((prev) => ({ ...prev, verifiedAmount: e.target.value }))
              }
            />

            <label className="block text-sm mb-1 font-medium">Verification Notes</label>
            <textarea
              rows="3"
              className="w-full p-2 border rounded mb-3 text-sm"
              placeholder="Optional verification notes..."
              value={verifyForm.verificationNotes}
              onChange={(e) =>
                setVerifyForm((prev) => ({ ...prev, verificationNotes: e.target.value }))
              }
            />

            <label className="block text-sm mb-1 font-medium">Final Status</label>
            <select
              className="w-full p-2 border rounded mb-4 text-sm"
              value={verifyForm.status}
              onChange={(e) => setVerifyForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={closeVerifyModal}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleVerifyPayment}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayment;