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

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  // Fetch Pending Orders
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      // Try to fetch from the specific pending endpoint first
      const response = await api.get("/reception/orders/pending");
      console.log(response.data); // Log the response to inspect the structure
      const pendingOrders = response.data.orders || [];

      // If no orders found, try fetching from history and filter for pending status
      if (pendingOrders.length === 0) {
        try {
          const historyResponse = await api.get("/reception/orders/history");
          const allOrders = historyResponse.data.orders || [];

          // Filter orders with pending status
          const filteredPendingOrders = allOrders.filter(
            (order) => order.orderStatus?.toLowerCase() === "pending"
          );

          setPendingOrders(filteredPendingOrders);
        } catch (historyErr) {
          console.error("Error fetching from history:", historyErr);
          setPendingOrders([]);
        }
      } else {
        setPendingOrders(pendingOrders);
      }
    } catch (err) {
      console.error("Error fetching from pending endpoint:", err);
      // Fallback: fetch from history and filter for pending status
      try {
        const historyResponse = await api.get("/reception/orders/history");
        const allOrders = historyResponse.data.orders || [];

        // Filter orders with pending status
        const filteredPendingOrders = allOrders.filter(
          (order) => order.orderStatus?.toLowerCase() === "pending"
        );

        setPendingOrders(filteredPendingOrders);
      } catch (fallbackErr) {
        console.error("Error fetching from history:", fallbackErr);
        setError("Error fetching pending orders");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status to Processing
  const updateOrderStatus = async (orderId) => {
    try {
      const response = await api.patch(`/reception/orders/${orderId}/status`, {
        status: "processing",
      });

      // Remove the order from the pending orders list since it's no longer pending
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );

      // Check if prices were updated
      if (response.data.priceUpdated && response.data.priceUpdateDetails) {
        setPriceUpdateModal({
          isOpen: true,
          details: response.data.priceUpdateDetails,
          orderId: orderId,
        });
      } else {
        setSuccessDialog({
          isOpen: true,
          message: response.data.message,
        });
      }
    } catch (err) {
      setError("Error updating order status");
    }
  };

  // Close price update modal
  const closePriceUpdateModal = () => {
    setPriceUpdateModal({
      isOpen: false,
      details: [],
      orderId: null,
    });
  };

  // Get Payment Status Color
  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    };
    return colors[status?.toLowerCase()] || "text-gray-600";
  };

  // Format Shipping Address
  const formatShippingAddress = (address) => {
    if (!address || typeof address !== "object") return "N/A";
    const { address: street, city, state, pinCode } = address;
    return `${street || ""}, ${city || ""}, ${state || ""} ${pinCode || ""}`.trim();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN");
  };

  // New handler for Mark as Processing
  const handleMarkAsProcessing = (order) => {
    // Always check for price updates
    if (
      order.priceUpdated &&
      order.priceUpdateHistory &&
      order.priceUpdateHistory.length > 0
    ) {
      setConfirmDialog({
        isOpen: true,
        order,
        priceUpdates: order.priceUpdateHistory,
      });
    } else {
      updateOrderStatus(order._id);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Pending Orders</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Loading pending orders...</p>}

      {/* Price Update Alert Dialog */}
      <AlertDialog
        open={priceUpdateModal.isOpen}
        onOpenChange={(open) => !open && closePriceUpdateModal()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Price Update Notice</AlertDialogTitle>
            <AlertDialogDescription>
              {priceUpdateModal.details.length > 0 ? (
                <ul className="mb-2">
                  {priceUpdateModal.details.map((detail, idx) => (
                    <li key={idx} className="mb-1">
                      Price for <b>{detail.product?.name || "Product"}</b>{" "}
                      increased from <b>₹{detail.oldPrice}</b> to{" "}
                      <b>₹{detail.newPrice}</b>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Some product prices have changed.</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closePriceUpdateModal}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Success Alert Dialog */}
      <AlertDialog
        open={successDialog.isOpen}
        onOpenChange={(open) =>
          !open && setSuccessDialog({ isOpen: false, message: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Status Updated</AlertDialogTitle>
            <AlertDialogDescription>
              {successDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setSuccessDialog({ isOpen: false, message: "" })}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Price Update Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ isOpen: false, order: null, priceUpdates: [] })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Price Update Detected</AlertDialogTitle>
            <AlertDialogDescription>
              {/* <ul className="mb-2">
                {confirmDialog.priceUpdates.map((detail, idx) => (
                  <li key={idx} className="mb-1">
                    Price for <b>{detail.product?.name || 'Product'}</b> changed from <b>₹{detail.oldPrice}</b> to <b>₹{detail.newPrice}</b>
                  </li>
                ))}
              </ul> */}
              <ul className="mb-2">
                {(() => {
                  const detail =
                    confirmDialog.priceUpdates[
                      confirmDialog.priceUpdates.length - 1
                    ];
                  return detail ? (
                    <li className="mb-1">
                      Price for <b>{detail.product?.name || "Product"}</b>{" "}
                      changed from <b>₹{detail.oldPrice}</b> to{" "}
                      <b>₹{detail.newPrice}</b>
                    </li>
                  ) : null;
                })()}
              </ul>
              Do you want to continue processing this order?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setConfirmDialog({
                  isOpen: false,
                  order: null,
                  priceUpdates: [],
                })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDialog({
                  isOpen: false,
                  order: null,
                  priceUpdates: [],
                });
                if (confirmDialog.order)
                  updateOrderStatus(confirmDialog.order._id);
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                      <td className="py-2 px-4 border-b">
                        {order.user?.name || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.user?.email || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.user?.phoneNumber || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.user?.customerDetails?.firmName || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {formatShippingAddress(order.shippingAddress)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.user?.customerDetails?.userCode ||
                          "(Miscellaneous)"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.orderStatus}
                      </td>
                      <td
                        className={`py-2 px-4 border-b font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.paymentMethod}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.product?.name || "N/A"}: {item.quantity || 1}
                          </div>
                        ))}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {typeof order.totalAmount === "number"
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : totalAmount > 0
                            ? `₹${totalAmount.toFixed(2)}`
                            : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleMarkAsProcessing(order)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Mark as Processing
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="13">
                    No pending orders found.
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

export default PendingOrders;
