import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import cookies from "js-cookie";
import Paginator from "../common/Paginator";

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});
api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // modals
  const [priceUpdateModal, setPriceUpdateModal] = useState({
    isOpen: false,
    details: [],
    orderId: null,
  });
  const [successDialog, setSuccessDialog] = useState({
    isOpen: false,
    message: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    order: null,
    priceUpdates: [],
  });
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    order: null,
  });

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // fetch orders
    const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reception/orders/pending");
      const pendingOrders = Array.isArray(response.data) ? response.data : (response.data.orders || []);
      setPendingOrders(pendingOrders);
    } catch {
      setError("Error fetching pending orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // update order
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await api.patch(`/reception/orders/${orderId}/status`, {
        status: "processing",
      });
      setPendingOrders((prev) => prev.filter((o) => o._id !== orderId));

      if (response.data.priceUpdated && response.data.priceUpdateDetails) {
        setPriceUpdateModal({
          isOpen: true,
          details: response.data.priceUpdateDetails,
          orderId,
        });
      } else setSuccessDialog({ isOpen: true, message: response.data.message });
    } catch {
      setError("Error updating order status");
    }
  };

  const handleMarkAsProcessing = (order) => {
    if (order.priceUpdated && order.priceUpdateHistory?.length > 0) {
      setConfirmDialog({
        isOpen: true,
        order,
        priceUpdates: order.priceUpdateHistory,
      });
    } else updateOrderStatus(order._id);
  };

  const filteredOrders = pendingOrders.filter((order) => {
    const s = search.toLowerCase();
    return (
      order._id.toLowerCase().includes(s) ||
      order.user?.name?.toLowerCase().includes(s) ||
      order.user?.email?.toLowerCase().includes(s) ||
      order.user?.phoneNumber?.toLowerCase().includes(s) ||
      order.user?.customerDetails?.firmName?.toLowerCase().includes(s) ||
      order.user?.customerDetails?.userCode?.toLowerCase().includes(s)
    );
  });

  // pagination logic
  const total = filteredOrders.length;
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedOrders = filteredOrders.slice(startIdx, endIdx);

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    };
    return colors[status?.toLowerCase()] || "text-gray-600";
  };

  const formatShippingAddress = (a) => {
    if (!a) return "N/A";
    return `${a.address || ""}, ${a.city || ""}, ${a.state || ""} ${a.pinCode || ""}`;
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleString("en-IN");
  };

  return (
    <div className="bg-green-100 min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Pending Orders</h1>

        {/* Search */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-3 py-2 border rounded w-full sm:w-72 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/*  TABLE  */}
        <div className="overflow-y-auto shadow-xl rounded-xl bg-white">
          <table className="min-w-full text-sm table-auto">
            {" "}
            {/* 👈 changed for free width */}
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="px-4 py-2">Order ID</th> {/* 👈 NEW */}
                <th className="px-4 py-2">User Code</th>
                <th className="px-4 py-2">Date & Time</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Firm Name</th>
                <th className="px-4 py-2">Payment Status</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.length ? (
                pagedOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{order.orderId}</td>{" "}
                    {/* 👈 NEW */}
                    <td className="px-4 py-2">
                      {order.user?.customerDetails?.userCode || "(Misc)"}
                    </td>
                    <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-2">{order.user?.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      {order.user?.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {order.user?.customerDetails?.firmName || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </td>
                    <td className="px-4 py-2">
                      ₹{order.totalAmountWithDelivery}
                    </td>{" "}
                    {/* 👈 UPDATED */}
                    <td className="px-4 py-2 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-200">
                          <MoreVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              setDetailsModal({ isOpen: true, order })
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMarkAsProcessing(order)}
                          >
                            Mark as Processing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No pending orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-4 flex items-center justify-between flex-wrap">
          <span className="text-sm">
            Showing {Math.min(total, startIdx + 1)}–{Math.min(total, endIdx)} of{" "}
            {total}
          </span>
          <Paginator
            page={page}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
          />
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(parseInt(e.target.value));
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*  VIEW DETAILS MODAL  */}
      {detailsModal.isOpen && detailsModal.order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full mx-4 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Order Details – {detailsModal.order.orderId}
            </h2>

            {/* CUSTOMER */}
            <div className="mb-4 text-sm">
              <p>
                <strong>Firm:</strong>{" "}
                {detailsModal.order.user?.customerDetails?.firmName}
              </p>
              <p>
                <strong>Name:</strong> {detailsModal.order.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {detailsModal.order.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {detailsModal.order.user?.phoneNumber}
              </p>
            </div>

            {/* PRODUCTS */}
            <h3 className="font-semibold mt-4 mb-2">Products:</h3>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Boxes</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {detailsModal.order.products?.map((p, i) => (
                  <tr key={i} className="border-b text-center">
                    <td className="px-3 py-2">{p.product?.name}</td>
                    <td className="px-3 py-2">{p.boxes}</td>
                    <td className="px-3 py-2">₹{p.price}</td>
                    <td className="px-3 py-2">₹{p.boxes * p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAYMENT HISTORY */}
            <h3 className="font-semibold mt-4 mb-2">Payment Status History:</h3>
            {detailsModal.order.paymentStatusHistory?.map((h, idx) => (
              <p key={idx} className="text-sm">
                🔹 {h.status} — {formatDate(h.updatedAt)}
              </p>
            ))}

            {/* CLOSE */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setDetailsModal({ isOpen: false, order: null })}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
