import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaPrint, FaTimes, FaCheck, FaSync } from "react-icons/fa";
import logo from '../../assets/logo1.png';
import cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
      const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const DispatchComponent = () => {
  const [processingOrders, setProcessingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [challanData, setChallanData] = useState({
    userCode: "",
    vehicleNo: "",
    driverName: "",
    mobileNo: "",
    items: [],
    receiverName: "",
    deliveryAddress: {
      address: "",
      city: "",
      state: "",
      pinCode: ""
    },
    deliveryChoice: "homeDelivery",
  });
  const [isChallanValid, setIsChallanValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [generatedChallan, setGeneratedChallan] = useState(null);
  const [showCODModal, setShowCODModal] = useState(false);
  const [codStatus, setCodStatus] = useState("");

  const fetchProcessingOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dispatch/orders/processing", {
        headers: { "Cache-Control": "no-cache" },
      });
      setProcessingOrders(response.data?.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching processing orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/dispatch/orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      if (["shipped", "cancelled"].includes(status)) {
        setProcessingOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      }
      await fetchProcessingOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating order status");
      await fetchProcessingOrders();
    }
  };

  const updateCODPaymentStatus = async (orderId) => {
    try {
      const response = await api.patch(`/dispatch/orders/${orderId}/cod-payment-status`, {
        paymentStatus: codStatus,
        notes: `Updated via dispatch interface on ${new Date().toLocaleDateString()}`,
      });
      toast.success(response.data.message || "COD payment status updated successfully");
      setProcessingOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: codStatus } : order
        )
      );
      setShowCODModal(false);
      setCodStatus("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating COD payment status");
    }
  };

  const generateChallan = async () => {
    try {
      const subtotal = challanData.items.reduce((acc, item) => acc + item.amount, 0);
      const gstRate = 0.18;
      const gstAmount = subtotal * gstRate;
      const deliveryCharge = selectedOrder.deliveryCharge || 0;
      const totalAmount = subtotal + gstAmount + deliveryCharge;

      const payload = {
        ...challanData,
        deliveryCharge,
        subtotal,
        gstAmount,
        totalAmount,
        shippingAddress: challanData.deliveryAddress,
      };

      const response = await api.post("/dispatch/generate-challan", payload);
      toast.success("Challan generated successfully!");
      setGeneratedChallan({
        ...response.data.challan,
        deliveryCharge,
        subtotal,
        gstAmount,
        totalAmount,
        shippingAddress: challanData.deliveryAddress,
      });
      setShowChallanModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error generating challan");
    }
  };

  const handleOrderSelection = (order) => {
    setSelectedOrder(order);
    setChallanData({
      userCode: order.user?.customerDetails?.userCode || "",
      vehicleNo: "",
      driverName: "",
      mobileNo: order.user?.customerDetails?.phone || "",
      items: order.products.map((item) => ({
        description: item.product?.name || "N/A",
        boxes: item.boxes >= 230 ? item.boxes : 230, // Ensure minimum 230 boxes
        rate: item.price || 0,
        amount: (item.boxes >= 230 ? item.boxes : 230) * (item.price || 0),
      })),
      receiverName: order.firmName || order.user?.name || "N/A",
      deliveryAddress: order.shippingAddress || {
        address: "",
        city: "",
        state: "",
        pinCode: ""
      },
      deliveryChoice: order.deliveryChoice || "homeDelivery",
    });
    setShowChallanModal(true);
  };

  const handleCODSelection = (order) => {
    if (order.paymentMethod !== "COD") {
      toast.warning("This action is only available for COD orders");
      return;
    }
    setSelectedOrder(order);
    setCodStatus(order.paymentStatus);
    setShowCODModal(true);
  };

  useEffect(() => {
    const isValid = 
      challanData.userCode &&
      challanData.vehicleNo &&
      challanData.driverName &&
      challanData.mobileNo &&
      challanData.receiverName &&
      challanData.deliveryAddress.address &&
      challanData.deliveryAddress.city &&
      challanData.deliveryAddress.state &&
      /^\d{6}$/.test(challanData.deliveryAddress.pinCode) &&
      challanData.items.length > 0 &&
      challanData.items.every(item => item.boxes >= 230);
    setIsChallanValid(isValid);
  }, [challanData]);

  const downloadChallan = () => {
    if (!generatedChallan) return toast.warning("No challan available to download.");
    const element = document.getElementById("challan-content");
    html2pdf()
      .from(element)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `challan_${generatedChallan.invoiceNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const printChallan = () => {
    if (!generatedChallan) return toast.warning("No challan available to print.");
    const element = document.getElementById("challan-content");
    html2pdf()
      .from(element)
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `challan_${generatedChallan.invoiceNo}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const blobURL = pdf.output("bloburl");
        const newWindow = window.open(blobURL, "_blank");
        if (newWindow) {
          newWindow.onload = () => {
            newWindow.document.body.style.margin = 0;
            newWindow.document.documentElement.style.height = "100%";
            newWindow.document.body.style.overflow = "hidden";
          };
        }
      });
  };

  useEffect(() => {
    fetchProcessingOrders();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />        

      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-between">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
            Active Processing Orders
          </h2>
          <button
            onClick={fetchProcessingOrders}
            className="p-3 bg-blue-600 text-white w-10 h-10 rounded-full hover:bg-blue-700 transition-colors duration-200"
            title="Refresh Orders"
          >
            <FaSync className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : processingOrders.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-teal-50 text-gray-700">
                  {["Firm Name", "Type", "Customer", "User Code", "Phone", "Address", "Status", "Payment", "Method", "Items", "Delivery", "Total", "Actions"].map((header) => (
                    <th key={header} className="py-3 px-4 text-left font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processingOrders.map((order, index) => (
                  <tr key={order._id} className={`border-b hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-3 px-4 font-medium">{order.firmName}</td>
                    <td className="py-3 px-4">{order.type}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4">{order.user?.customerDetails?.userCode || "N/A"}</td>
                    <td className="py-2 px-4 border-b">{order.user?.phoneNumber || "N/A"}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {order.shippingAddress
                        ? `${order.shippingAddress.address || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.pinCode || ""}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === "processing" ? "bg-yellow-100 text-yellow-800" :
                        order.orderStatus === "confirmed" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.paymentStatus === "pending" ? "bg-red-100 text-red-800" :
                        order.paymentStatus === "completed" ? "bg-green-100 text-green-800" :
                        "bg-orange-100 text-orange-800"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.paymentMethod}</td>
                    <td className="py-3 px-4">
                      {order.products.map((item, i) => (
                        <div key={i} className="text-sm">{item.product?.name}: {item.boxes}</div>
                      ))}
                    </td>
                    <td className="py-3 px-4">₹ {order.deliveryCharge || 0}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      ₹ {order.totalAmountWithDelivery || order.totalAmount}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <select
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="p-1 border rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Status</option>
                        {["confirmed", "shipped", "cancelled"].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleOrderSelection(order)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Challan
                      </button>
                      {order.paymentMethod === "COD" && (
                        <button
                          onClick={() => handleCODSelection(order)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200"
                        >
                          COD
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No active processing orders found.</p>
        )}
      </div>

      {showCODModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Update COD Status</h2>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Order: {selectedOrder.orderId}</label>
              <select
                value={codStatus}
                onChange={(e) => setCodStatus(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="payment_received_by_driver">Received by Driver</option>
                <option value="cash_paid_offline">Cash Paid Offline</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCODModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => updateCODPaymentStatus(selectedOrder._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showChallanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Generate Delivery Challan</h2>
            <form className="space-y-4">
              {[
                { label: "User Code", value: challanData.userCode, readOnly: true },
                { label: "Vehicle Number", key: "vehicleNo" },
                { label: "Driver Name", key: "driverName" },
                { label: "Mobile Number", key: "mobileNo" },
                { label: "Receiver Name", key: "receiverName" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-gray-700 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={field.value || challanData[field.key || field.label.toLowerCase().replace(" ", "")]}
                    onChange={(e) => !field.readOnly && setChallanData({ ...challanData, [field.key || field.label.toLowerCase().replace(" ", "")]: e.target.value })}
                    readOnly={field.readOnly}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={challanData.deliveryAddress.address}
                  onChange={(e) => setChallanData({
                    ...challanData,
                    deliveryAddress: { ...challanData.deliveryAddress, address: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={challanData.deliveryAddress.city}
                  onChange={(e) => setChallanData({
                    ...challanData,
                    deliveryAddress: { ...challanData.deliveryAddress, city: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={challanData.deliveryAddress.state}
                  onChange={(e) => setChallanData({
                    ...challanData,
                    deliveryAddress: { ...challanData.deliveryAddress, state: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={challanData.deliveryAddress.pinCode}
                  onChange={(e) => setChallanData({
                    ...challanData,
                    deliveryAddress: { ...challanData.deliveryAddress, pinCode: e.target.value }
                  })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Delivery Choice</label>
                <select
                  value={challanData.deliveryChoice}
                  onChange={(e) => setChallanData({ ...challanData, deliveryChoice: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="homeDelivery">Home Delivery</option>
                  <option value="companyPickup">Company Pickup</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Items</label>
                {challanData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input value={item.description} readOnly className="p-2 border rounded-md bg-gray-100" />
                    <input value={item.boxes} readOnly className="p-2 border rounded-md bg-gray-100" />
                    <input value={item.rate} readOnly className="p-2 border rounded-md bg-gray-100" />
                    <input value={item.amount} readOnly className="p-2 border rounded-md bg-gray-100" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowChallanModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="button"
                  onClick={generateChallan}
                  disabled={!isChallanValid}
                  className={`px-4 py-2 text-white rounded-md flex items-center gap-2 ${
                    isChallanValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  } transition-colors duration-200`}
                >
                  <FaCheck /> Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {generatedChallan && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Delivery Challan
            </h2>
            <div id="challan-content" className="space-y-6">
              <div className="text-center border-b pb-4">
                <img src={logo} alt="Optima Polyplast LLP Logo" className="mx-auto w-38 h-32 mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">OPTIMA POLYPLAST LLP</h1>
                <p className="text-gray-600">Plot No.12,296, Industrial Road, Near Umiya Battery</p>
                <p className="text-gray-600">Mota Jalundra Industrial Zone, Derojnagar, Gandhinagar, Gujarat</p>
                <p className="text-gray-600">Phone: +919274658587 | Email: info@optimapoliplast.com</p>
                <p className="text-sm text-gray-500">ISO 9001:2015 Certified Company</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Challan No:</strong> {generatedChallan.invoiceNo}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>User Code:</strong> {generatedChallan.userCode}</p>
                <p><strong>Receiver:</strong> {generatedChallan.receiverName}</p>
                <p><strong>Vehicle No:</strong> {generatedChallan.vehicleNo}</p>
                <p><strong>Mobile:</strong> {generatedChallan.mobileNo}</p>
                <p><strong>Driver:</strong> {generatedChallan.driverName}</p>
                <p><strong>Delivery Address:</strong> {`${generatedChallan.shippingAddress.address}, ${generatedChallan.shippingAddress.city}, ${generatedChallan.shippingAddress.state} - ${generatedChallan.shippingAddress.pinCode}`}</p>
                <p><strong>Delivery Choice:</strong> {generatedChallan.deliveryChoice === "homeDelivery" ? "Home Delivery" : "Company Pickup"}</p>
              </div>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-teal-50">
                    <th className="py-1 px-2 border-b">No</th>
                    <th className="py-1 px-2 border-b">Description</th>
                    <th className="py-1 px-2 border-b">Boxes</th>
                    <th className="py-1 px-2 border-b">Rate</th>
                    <th className="py-1 px-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedChallan.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-1 px-2 text-center">{index + 1}</td>
                      <td className="py-1 px-2">{item.description}</td>
                      <td className="py-1 px-2 text-center">{item.boxes}</td>
                      <td className="py-1 px-2 text-right">{item.rate}</td>
                      <td className="py-1 px-2 text-right">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right space-y-2 text-sm">
                <p><strong>Subtotal:</strong> ₹ {generatedChallan.subtotal.toFixed(2)}</p>
                <p><strong>GST (5%):</strong> ₹ {generatedChallan.gstAmount.toFixed(2)}</p>
                <p><strong>Delivery Charge:</strong> ₹ {generatedChallan.deliveryCharge === 0 ? 'Free' : generatedChallan.deliveryCharge.toFixed(2)}</p>
                <p className="text-lg font-semibold"><strong>Grand Total:</strong> ₹ {generatedChallan.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t text-sm">
                <p className="text-gray-600">Issuer’s Signature: ________________</p>
                <p className="text-gray-600">Receiver's Signature: ________________</p>
              </div>
              <br />
              <br />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={downloadChallan}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaDownload /> Download
              </button>
              <button
                onClick={printChallan}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              >
                <FaPrint /> Print
              </button>
              <button
                onClick={() => setGeneratedChallan(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
              >
                <FaTimes /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchComponent;