


import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaPrint, FaSearch } from "react-icons/fa";
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
  const [userChallans, setUserChallans] = useState([]);
  const [searchUserCode, setSearchUserCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch processing orders
  const fetchProcessingOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dispatch/orders/processing");
      setProcessingOrders(response.data?.orders || []);
    } catch (error) {
      toast.error("Error fetching processing orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch challans by user code
  const fetchChallansByUserCode = async (userCode) => {
    if (!userCode) {
      toast.warning("Please enter a user code.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(`/dispatch/challans/${userCode}`);
      setUserChallans(response.data.challans || []);
    } catch (error) {
      toast.error("Error fetching challans");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchUserCode(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChallansByUserCode(searchUserCode);
  };

  // Download Challan as PDF
  const downloadChallan = (challan) => {
    const element = document.createElement("div");
    element.innerHTML = getChallanHTML(challan);
    const opt = {
      margin: 0.5,
      filename: `challan_${challan.invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  // Print Challan
  const printChallan = (challan) => {
    const element = document.createElement("div");
    element.innerHTML = getChallanHTML(challan);
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: `challan_${challan.invoiceNo}.pdf`,
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

  // Generates HTML structure for the Challan (Updated to match the provided image)
  const getChallanHTML = (challan) => {
    const subtotal = challan.items.reduce((acc, item) => acc + item.amount, 0);
    const gstRate = 0.05; // 5% GST
    const gstAmount = subtotal * gstRate;
    const deliveryCharge = challan.deliveryCharge || 0;
    const totalAmount = subtotal + gstAmount + deliveryCharge;

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <!-- Header Section -->
        <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <img src="${logo}" alt="Optima Polyplast LLP Logo" style="width: 120px; height: auto; margin-bottom: 10px; margin-left: auto; margin-right: auto;">
          <h1 style="font-size: 24px; font-weight: bold; color: #333; margin: 5px 0;">OPTIMA POLYPLAST LLP</h1>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">Plot No. 12, 296, Industrial Road, Near Umiya Battery</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">Mota Jalundra Industrial Zone, Derojnagar, Gandhinagar, Gujarat</p>
          <p style="font-size: 12px; color: #666; margin: 2px 0;">Phone: +91 9274658587 | Email: info@optimapoliplast.com</p>
          <p style="font-size: 10px; color: #999; margin: 2px 0;">ISO 9001:2015 Certified Company</p>
        </div>

        <!-- Challan Details Section -->
        <div style="margin-top: 20px; font-size: 12px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <p><strong>Challan No:</strong> ${challan.invoiceNo}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>User Code:</strong> ${challan.userCode}</p>
            <p><strong>Receiver:</strong> ${challan.receiverName}</p>
            <p><strong>Vehicle No:</strong> ${challan.vehicleNo}</p>
            <p><strong>Mobile:</strong> ${challan.mobileNo}</p>
            <p><strong>Driver:</strong> ${challan.driverName}</p>
           
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
          <thead>
            <tr style="background: #f0f9ff;">
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left;">No</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: left;">Description</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: center;">Boxes</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: right;">Rate</th>
              <th style="padding: 8px; border: 1px solid #ccc; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${challan.items
              .map(
                (item, index) => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${index + 1}</td>
                    <td style="padding: 8px; border: 1px solid #ccc;">${item.description}</td>
                    <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.boxes}</td>
                    <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">${item.rate}</td>
                    <td style="padding: 8px; border: 1px solid #ccc; text-align: right;">${item.amount}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Totals Section -->
        <div style="text-align: right; margin-top: 20px; font-size: 12px;">
          <p><strong>Subtotal:</strong> ₹ ${subtotal.toFixed(2)}</p>
          <p><strong>GST (5%):</strong> ₹ ${gstAmount.toFixed(2)}</p>
          <p><strong>Delivery Charge:</strong> ₹ ${deliveryCharge === 0 ? "Free" : deliveryCharge.toFixed(2)}</p>
          <p style="font-size: 14px; font-weight: bold;"><strong>Grand Total:</strong> ₹ ${totalAmount.toFixed(2)}</p>
        </div>

        <!-- Signature Section -->
        <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px;">
          <p style="color: #666;">Issuer’s Signature: ________________</p>
          <p style="color: #666;">Receiver's Signature: ________________</p>
        </div>
      </div>
    `;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProcessingOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Dispatch Management</h1>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Enter User Code"
            value={searchUserCode}
            onChange={handleSearchInputChange}
            className="p-2 border rounded"
          />
          <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
            <FaSearch /> Search
          </button>
        </form>
      </div>

      {/* Display User Challans */}
      {userChallans.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Generated Challans for User Code: {searchUserCode}
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Invoice No</th>
                <th className="py-2 px-4 border-b">User Code</th>
                <th className="py-2 px-4 border-b">Vehicle Number</th>
                <th className="py-2 px-4 border-b">Driver Name</th>
                <th className="py-2 px-4 border-b">Mobile Number</th>
                <th className="py-2 px-4 border-b">Receiver Name</th>
                <th className="py-2 px-4 border-b">Total Amount</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userChallans.map((challan) => (
                <tr key={challan._id} className="border">
                  <td className="py-2 px-4 border-b">{challan.invoiceNo}</td>
                  <td className="py-2 px-4 border-b">{challan.userCode}</td>
                  <td className="py-2 px-4 border-b">{challan.vehicleNo}</td>
                  <td className="py-2 px-4 border-b">{challan.driverName}</td>
                  <td className="py-2 px-4 border-b">{challan.mobileNo}</td>
                  <td className="py-2 px-4 border-b">{challan.receiverName}</td>
                  <td className="py-2 px-4 border-b">₹ {challan.totalAmount}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => downloadChallan(challan)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                      <FaDownload /> Download
                    </button>
                    <button onClick={() => printChallan(challan)} className="px-4 py-2 bg-purple-500 text-white rounded">
                      <FaPrint /> Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DispatchComponent;