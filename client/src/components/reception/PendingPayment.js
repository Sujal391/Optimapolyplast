import React, { useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import Paginator from "../common/Paginator";
import { toast } from "react-toastify";

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
    pending: "text-yellow-600",
    completed: "text-green-600",
    failed: "text-red-600",
    submitted: "text-blue-600",
    verified: "text-green-700",
  };
  return colors[s] || "text-gray-600";
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

  // SUBMITTED PAYMENTS STATE
  const [submittedPayments, setSubmittedPayments] = useState([]);
  const [submittedLoading, setSubmittedLoading] = useState(false);
  const [submittedError, setSubmittedError] = useState("");

  const [submittedPage, setSubmittedPage] = useState(1);
  const [submittedPageSize, setSubmittedPageSize] = useState(10);

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
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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

    // Optional: you can restrict to <= remainingAmount if needed
    if (remainingAmount && parsedAmount > remainingAmount) {
      return toast.warning(
        "Received amount cannot be greater than remaining amount."
      );
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
                  paidAmount:
                    typeof updated.paidAmount === "number"
                      ? updated.paidAmount
                      : p.paidAmount,
                  remainingAmount:
                    typeof updated.remainingAmount === "number"
                      ? updated.remainingAmount
                      : p.remainingAmount,
                  totalAmount:
                    typeof updated.totalAmount === "number"
                      ? updated.totalAmount
                      : p.totalAmount,
                }
              : p
          )
        );
      } else {
        // fallback: just update status
        setPendingPayments((prev) =>
          prev.map((p) =>
            p.paymentId === paymentId
              ? { ...p, paymentStatus, status: paymentStatus }
              : p
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
                  paidAmount:
                    typeof updated.paidAmount === "number"
                      ? updated.paidAmount
                      : p.paidAmount,
                  remainingAmount:
                    typeof updated.remainingAmount === "number"
                      ? updated.remainingAmount
                      : p.remainingAmount,
                  verifiedAmount:
                    typeof updated.verifiedAmount === "number"
                      ? updated.verifiedAmount
                      : p.verifiedAmount,
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

  // LOAD SUBMITTED WHEN TAB FIRST OPENED
  useEffect(() => {
    if (activeTab === "submitted" && submittedPayments.length === 0) {
      fetchSubmittedPayments();
    }
  }, [activeTab, submittedPayments.length]);

  // PAGINATION SLICES
  const pendingTotal = pendingPayments.length;
  const pendingStartIdx = (pendingPage - 1) * pendingPageSize;
  const pendingEndIdx = pendingStartIdx + pendingPageSize;
  const pagedPending = pendingPayments.slice(pendingStartIdx, pendingEndIdx);

  const submittedTotal = submittedPayments.length;
  const submittedStartIdx = (submittedPage - 1) * submittedPageSize;
  const submittedEndIdx = submittedStartIdx + submittedPageSize;
  const pagedSubmitted = submittedPayments.slice(
    submittedStartIdx,
    submittedEndIdx
  );

  return (
    <div className="min-h-screen bg-green-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Payment Management
        </h1>

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
            Pending Payments
            {pendingCount ? ` (${pendingCount})` : ""}
          </button>
          <button
            className={`ml-4 px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === "submitted"
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-600"
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            Submitted Payments
            {submittedTotal ? ` (${submittedTotal})` : ""}
          </button>
        </div>

        {/* PENDING PAYMENTS TAB */}
        {activeTab === "pending" && (
          <>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Pending Payments</h2>
              <button
                onClick={handleDownloadExcel}
                disabled={downloadingExcel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingExcel ? "Downloading..." : "Download Excel"}
              </button>
            </div>

            {pendingLoading && <p>Loading pending payments...</p>}
            {pendingError && (
              <div className="text-red-600 mb-2">{pendingError}</div>
            )}

            <div className="overflow-x-auto shadow-xl rounded-xl">
              <table className="min-w-full bg-stone-100 border">
                <thead className="bg-gray-400 text-black">
  <tr>
    {[
      "Payment ID",
      "Customer",
      "Amount",
      "Paid",
      "Remaining",
      "Status",
      "Action",
    ].map((th) => (
      <th
        key={th}
        className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700 whitespace-nowrap"
      >
        {th}
      </th>
    ))}
  </tr>
</thead>


                <tbody>
                  {pagedPending.length > 0 ? (
                    pagedPending.map((payment) => (
                      <tr
                        key={payment.paymentId}
                        className="hover:bg-gray-50 text-sm"
                      >
                        <td className="py-3 px-4">{payment.paymentId}</td>
                        <td className="py-3 px-4">{payment.orderId}</td>
                        <td className="py-3 px-4">
                          {payment.user?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {payment.user?.firmName || payment.firmName || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {payment.user?.userCode || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <div>{payment.user?.phoneNumber || "N/A"}</div>
                          <div className="text-xs text-gray-500">
                            {payment.user?.email || "—"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {payment.products?.length ? (
                            payment.products.map((p, idx) => (
                              <div key={idx} className="text-xs mb-1">
                                <div className="font-medium">
                                  {p.productName} ({p.productType})
                                </div>
                                <div>
                                  {p.boxes} boxes @ ₹{p.price}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(payment.totalAmount)}
                        </td>
                        <td className="py-3 px-4 text-green-600">
                          {formatCurrency(payment.paidAmount)}
                        </td>
                        <td className="py-3 px-4 text-red-600">
                          {formatCurrency(payment.remainingAmount)}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(payment.deliveryCharge)}
                        </td>
                        <td className="py-3 px-4">
                          {formatCurrency(payment.totalAmountWithDelivery)}
                        </td>
                        <td className="py-3 px-4">
                          {payment.paymentMethod || "N/A"}
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
                        <td className="py-3 px-4">
                          {payment.orderStatus || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {payment.gstNumber || "—"}
                        </td>
                        <td className="py-3 px-4">
                          {formatDateTime(payment.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openStatusModal(payment)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                          >
                            Update Payment Status
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !pendingLoading && (
                      <tr>
                        <td
                          className="text-center py-3 text-sm"
                          colSpan={18}
                        >
                          No pending payments found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - PENDING */}
            <div className="mt-4 flex items-center justify-between">
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
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold">Submitted Payments</h2>
              <button
                onClick={fetchSubmittedPayments}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>

            {submittedLoading && <p>Loading submitted payments...</p>}
            {submittedError && (
              <div className="text-red-600 mb-2">{submittedError}</div>
            )}

            <div className="overflow-x-auto shadow-xl rounded-xl">
              <table className="min-w-full bg-stone-100 border">
                <thead className="bg-gray-400 text-black">
                  <tr>
                    {[
                      "Payment ID",
                      "Customer Name",
                      "Firm Name",
                      "User Code",
                      "Contact",
                      "Amount",
                      "Paid",
                      "Remaining",
                      "Status",
                      "Last Submission",
                      "Payment Method",
                      "Order Status",
                      "Action",
                    ].map((th) => (
                      <th
                        key={th}
                        className="py-3 px-4 border-b text-left text-xs font-semibold text-gray-700"
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
                          ? payment.paymentHistory[
                              payment.paymentHistory.length - 1
                            ]
                          : null;
                      const order = payment.orderDetails || {};
                      return (
                        <tr
                          key={payment._id || payment.paymentId}
                          className="hover:bg-gray-50 text-sm"
                        >
                          <td className="py-3 px-4">
                            {payment._id || payment.paymentId}
                          </td>
                          <td className="py-3 px-4">
                            {payment.user?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {payment.user?.customerDetails?.firmName ||
                              "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {payment.user?.customerDetails?.userCode || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <div>{payment.user?.phoneNumber || "N/A"}</div>
                            <div className="text-xs text-gray-500">
                              {payment.user?.email || "—"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-4 text-green-600">
                            {formatCurrency(payment.paidAmount)}
                          </td>
                          <td className="py-3 px-4 text-red-600">
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
                                <div>
                                  Ref: {lastHistory.referenceId || "—"}
                                </div>
                                <div>
                                  Amt:{" "}
                                  {formatCurrency(
                                    lastHistory.submittedAmount
                                  )}
                                </div>
                                <div>
                                  On:{" "}
                                  {formatDateTime(
                                    lastHistory.submissionDate
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">
                                No history
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {order.paymentMethod || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {order.orderStatus || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => openVerifyModal(payment)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    !submittedLoading && (
                      <tr>
                        <td
                          className="text-center py-3 text-sm"
                          colSpan={13}
                        >
                          No submitted payments found.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION - SUBMITTED */}
            <div className="mt-4 flex items-center justify-between">
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

      {/* UPDATE PAYMENT STATUS MODAL */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Update Payment Status
            </h2>
            <p className="text-sm mb-2 text-gray-600">
              Current status:{" "}
              <span className="font-semibold">
                {statusModal.currentStatus || "pending"}
              </span>
            </p>
            <p className="text-sm mb-4 text-gray-600">
              Remaining amount:{" "}
              <span className="font-semibold">
                {formatCurrency(statusModal.remainingAmount)}
              </span>
            </p>

            <label className="block text-sm mb-1 font-medium">
              Payment Status
            </label>
            <select
              className="w-full p-2 border rounded mb-3 text-sm"
              value={statusForm.paymentStatus}
              onChange={(e) =>
                setStatusForm((prev) => ({
                  ...prev,
                  paymentStatus: e.target.value,
                }))
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <label className="block text-sm mb-1 font-medium">
              Received Amount
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-3 text-sm"
              value={statusForm.receivedAmount}
              onChange={(e) =>
                setStatusForm((prev) => ({
                  ...prev,
                  receivedAmount: e.target.value,
                }))
              }
            />

            <label className="block text-sm mb-1 font-medium">Remarks</label>
            <textarea
              rows="3"
              className="w-full p-2 border rounded mb-4 text-sm"
              placeholder="Optional notes about this payment..."
              value={statusForm.remarks}
              onChange={(e) =>
                setStatusForm((prev) => ({
                  ...prev,
                  remarks: e.target.value,
                }))
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeStatusModal}
              >
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

      {/* VERIFY PAYMENT MODAL */}
      {verifyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Verify Payment</h2>
            <p className="text-sm mb-3 text-gray-600">
              Suggested verified amount:{" "}
              <span className="font-semibold">
                {formatCurrency(verifyModal.suggestedAmount)}
              </span>
            </p>

            <label className="block text-sm mb-1 font-medium">
              Verified Amount
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded mb-3 text-sm"
              value={verifyForm.verifiedAmount}
              onChange={(e) =>
                setVerifyForm((prev) => ({
                  ...prev,
                  verifiedAmount: e.target.value,
                }))
              }
            />

            <label className="block text-sm mb-1 font-medium">
              Verification Notes
            </label>
            <textarea
              rows="3"
              className="w-full p-2 border rounded mb-3 text-sm"
              placeholder="Optional verification notes..."
              value={verifyForm.verificationNotes}
              onChange={(e) =>
                setVerifyForm((prev) => ({
                  ...prev,
                  verificationNotes: e.target.value,
                }))
              }
            />

            <label className="block text-sm mb-1 font-medium">
              Final Status
            </label>
            <select
              className="w-full p-2 border rounded mb-4 text-sm"
              value={verifyForm.status}
              onChange={(e) =>
                setVerifyForm((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeVerifyModal}
              >
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
