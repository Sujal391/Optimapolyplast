// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaDownload, FaPrint, FaTimes, FaCheck } from "react-icons/fa";
// import logo from '../../assets/logo1.png';

// // Axios instance with base URL and authorization header
// const api = axios.create({
//   baseURL: "https://rewa-project.onrender.com/api",
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token.startsWith("Bearer ")
//         ? token
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const DispatchComponent = () => {
//   const [processingOrders, setProcessingOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [challanData, setChallanData] = useState({
//     userCode: "",
//     vehicleNo: "",
//     driverName: "",
//     mobileNo: "",
//     items: [],
//     receiverName: "",
//   });
//   const [isChallanValid, setIsChallanValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [generatedChallan, setGeneratedChallan] = useState(null);

//   // Fetch processing orders
//   const fetchProcessingOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get("/dispatch/orders/processing");
//       setProcessingOrders(response.data?.orders || []);
//     } catch (error) {
//       toast.error("Error fetching processing orders");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update order status
//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await api.patch(`/dispatch/orders/${orderId}/status`, { status });
//       toast.success(`Order status updated to ${status}`);

//       // Update the local state based on the new status
//       setProcessingOrders((prevOrders) => {
//         const updatedOrders = prevOrders.map((order) => {
//           if (order._id === orderId) {
//             return { ...order, orderStatus: status };
//           }
//           return order;
//         });

//         // Filter out orders with status "delivered" or "cancelled"
//         return updatedOrders.filter(
//           (order) => !["delivered", "cancelled"].includes(order.orderStatus)
//         );
//       });
//     } catch (error) {
//       toast.error("Error updating order status");
//     }
//   };

//   const generateChallan = async () => {
//     try {
//       // Include deliveryCharge in the challanData
//       const payload = {
//         ...challanData,
//         deliveryCharge: selectedOrder.deliveryCharge || 0, // Add delivery charge from the selected order
//       };

//       const response = await api.post("/dispatch/generate-challan", payload);
//       toast.success("Challan generated successfully!");

//       // Set the generated challan with deliveryCharge and total amount
//       setGeneratedChallan({
//         ...response.data.challan,
//         deliveryCharge: payload.deliveryCharge, // Include delivery charge
//         totalAmount: response.data.challan.totalAmount + payload.deliveryCharge, // Update total amount
//       });

//       setShowChallanModal(false); // Close the input modal
//     } catch (error) {
//       toast.error("Error generating challan");
//     }
//   };

//   // Handle order selection for challan generation
//   const handleOrderSelection = (order) => {
//     setSelectedOrder(order);
//     setChallanData({
//       userCode: order.user?.customerDetails?.userCode || "",
//       vehicleNo: "",
//       driverName: "",
//       mobileNo: "",
//       items: order.products.map((item) => ({
//         description: item.product?.name || "N/A",
//         quantity: item.quantity || 1,
//         rate: item.price || 0,
//         amount: (item.quantity || 1) * (item.price || 0),
//       })),
//       receiverName: order.user?.name || "N/A",
//       deliveryCharge: order.deliveryCharge || 0, // Include delivery charge
//     });
//     setShowChallanModal(true);
//   };

//   // Validate challan data
//   useEffect(() => {
//     const isValid =
//       challanData.userCode &&
//       challanData.vehicleNo &&
//       challanData.driverName &&
//       challanData.mobileNo &&
//       challanData.receiverName &&
//       challanData.items.length > 0;
//     setIsChallanValid(isValid);
//   }, [challanData]);

//   // Download Challan as PDF
//   const downloadChallan = () => {
//     if (!generatedChallan) {
//       toast.warning("No challan available to download.");
//       return;
//     }
//     const element = document.getElementById("challan-content");
//     const opt = {
//       margin: 1,
//       filename: `challan_${generatedChallan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   // Print Challan
//   const printChallan = () => {
//     if (!generatedChallan) {
//       toast.warning("No challan available to print.");
//       return;
//     }

//     const element = document.getElementById("challan-content");
//     const opt = {
//       margin: 1,
//       filename: `challan_${generatedChallan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };

//     // Generate the PDF
//     html2pdf().from(element).set(opt).toPdf().get("pdf").then((pdf) => {
//       const blobURL = pdf.output("bloburl");
//       const newWindow = window.open(blobURL, "_blank");

//       // Check if the new window opened successfully
//       if (!newWindow) {
//         toast.error("Failed to open PDF in a new window.");
//       } else {
//         // Set the window size to full screen
//         newWindow.onload = () => {
//           newWindow.document.body.style.margin = 0;
//           newWindow.document.documentElement.style.margin = 0;
//           newWindow.document.body.style.height = "100%";
//           newWindow.document.documentElement.style.height = "100%";
//           newWindow.document.body.style.overflow = "hidden";
//           newWindow.document.documentElement.style.overflow = "hidden";
//         };
//       }
//     });
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchProcessingOrders();
//   }, []);

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <ToastContainer />
//       <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4">
//         <h1 className="text-xl md:text-2xl font-bold text-blue-600">Dispatch Management</h1>
//       </div>

//       {/* Processing Orders Table */}
//       <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
//         <h2 className="text-lg md:text-3xl font-semibold mb-4 text-blue-600">
//           Processing Orders
//         </h2>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : processingOrders.length > 0 ? (
//           <table className="w-full border-collapse divide-y divide-gray-200">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-2 border-b">Order ID</th>
//                 <th className="py-2 px-2 border-b">Customer Name</th>
//                 <th className="py-2 px-2 border-b">Email</th>
//                 <th className="py-2 px-2 border-b">Phone Number</th>
//                 <th className="py-2 px-2 border-b">Firm Name</th>
//                 <th className="py-2 px-2 border-b">Shipping Address</th>
//                 <th className="py-2 px-2 border-b">User Code</th>
//                 <th className="py-2 px-2 border-b">Order Status</th>
//                 <th className="py-2 px-2 border-b">Payment Status</th>
//                 <th className="py-2 px-2 border-b">Payment Method</th>
//                 <th className="py-2 px-2 border-b">Quantity</th>
//                 <th className="py-2 px-2 border-b">Delivery Charge</th>
//                 <th className="py-2 px-2 border-b">Total Amount</th>
//                 <th className="py-2 px-2 border-b">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {processingOrders.map((order) => (
//                 <tr key={order._id} className="border">
//                   <td className="py-2 px-2 border-b">{order.orderId}</td>
//                   <td className="py-2 px-2 border-b">
//                     {order.user?.name || "N/A"}
//                   </td>
//                   <td className="py-2 px-2 border-b">{order.user?.email || "N/A"}</td>
//                   <td className="py-2 px-2 border-b">{order.user?.phoneNumber || "N/A"}</td>
//                   <td className="py-2 px-2 border-b">
//                     {order.user?.customerDetails?.firmName || "N/A"}
//                   </td>
//                   <td className="py-2 px-2 border-b">
//                     {order.shippingAddress || "N/A"}
//                   </td>
//                   <td className="py-2 px-2 border-b">
//                     {order.user?.customerDetails?.userCode || "N/A"}
//                   </td>
//                   <td className="py-2 px-2 border-b text-blue-500">{order.orderStatus}</td>
//                   <td className="py-2 px-2 border-b">{order.paymentStatus}</td>
//                   <td className="py-2 px-2 border-b">{order.paymentMethod}</td>
//                   <td className="py-2 px-2 border-b">
//                     {order.products.map((item, index) => (
//                       <div key={index} className="mb-1">
//                         {item.product?.name || "N/A"}: {item.quantity || 1}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="py-2 px-2 border-b">₹ {order.deliveryCharge || 0}</td>
//                   <td className="py-2 px-2 border-b text-white bg-blue-500">₹ {(order.totalAmount || 0) + (order.deliveryCharge || 0)}</td>
//                   <td className="py-2 px-2 border-b">
//                     <select
//                       onChange={(e) =>
//                         updateOrderStatus(order._id, e.target.value)
//                       }
//                       className="p-1 border rounded"
//                     >
//                       <option value="">Update Status</option>
//                       {["confirmed", "shipped", "delivered", "cancelled"].map(
//                         (status) => (
//                           <option key={status} value={status}>
//                             {status}
//                           </option>
//                         )
//                       )}
//                     </select>
//                     <button
//                       onClick={() => handleOrderSelection(order)}
//                       className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
//                     >
//                       Generate Challan
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No processing orders available.</p>
//         )}
//       </div>

//       {/* Challan Generation Modal */}
//       {showChallanModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4 text-blue-600">
//               Generate Challan
//             </h2>
//             <form>
//               <div className="mb-4">
//                 <label className="block text-gray-700">User Code</label>
//                 <input
//                   type="text"
//                   value={challanData.userCode}
//                   readOnly
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Vehicle Number</label>
//                 <input
//                   type="text"
//                   value={challanData.vehicleNo}
//                   onChange={(e) =>
//                     setChallanData({ ...challanData, vehicleNo: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Driver Name</label>
//                 <input
//                   type="text"
//                   value={challanData.driverName}
//                   onChange={(e) =>
//                     setChallanData({ ...challanData, driverName: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Mobile Number</label>
//                 <input
//                   type="text"
//                   value={challanData.mobileNo}
//                   onChange={(e) =>
//                     setChallanData({ ...challanData, mobileNo: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Receiver Name</label>
//                 <input
//                   type="text"
//                   value={challanData.receiverName}
//                   onChange={(e) =>
//                     setChallanData({ ...challanData, receiverName: e.target.value })
//                   }
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Items</label>
//                 {challanData.items.map((item, index) => (
//                   <div key={index} className="mb-2">
//                     <input
//                       type="text"
//                       value={item.description}
//                       readOnly
//                       className="w-full p-2 border rounded"
//                     />
//                     <input
//                       type="number"
//                       value={item.quantity}
//                       readOnly
//                       className="w-full p-2 border rounded"
//                     />
//                     <input
//                       type="number"
//                       value={item.rate}
//                       readOnly
//                       className="w-full p-2 border rounded"
//                     />
//                     <input
//                       type="number"
//                       value={item.amount}
//                       readOnly
//                       className="w-full p-2 border rounded"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setShowChallanModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
//                 >
//                   <FaTimes /> Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={generateChallan}
//                   className="px-4 py-2 bg-green-500 text-white rounded"
//                 >
//                   <FaCheck /> Generate Challan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//       {/* Display Generated Challan */}
//       {generatedChallan && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//     <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 max-h-screen overflow-y-auto"> {/* Scrollable container */}
//       <h2 className="text-2xl font-semibold mb-4 text-blue-600">
//         Generated Challan
//       </h2>
//       <div id="challan-content" className="space-y-4">
//         <div className="text-center">
//           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <img src={logo} alt="Optima Polyplast LLP Logo" style={{ width: '150px', height: '100px', marginBottom: '10px' }}/>
//           </div>
//           <h1 className="text-xl font-bold">OPTIMA POLYPLAST LLP</h1>
//           <p className="text-lg">Plot No.12,296, Industrial Road, Near Umiya Battery,
//              Mota Jalundra Industrial Zone, Derojnagar,
//               Gandhinagar, Gujarat, India</p>
//           <p className="text-sm">Phone: +919274658587</p>
//           <p className="text-sm">Email: info@optimapoliplast.com</p>
//           <p className="text-sm">ISO 9001:2015 Certified Company</p>
//         </div>
//         <div className="flex justify-between">
//         <p><strong>Challan No:</strong> {generatedChallan.invoiceNo}</p>
//           <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
//           </div>
//         <div className="flex justify-between">
       
//         <p><strong>User Code:</strong> {generatedChallan.userCode}</p>
//         <p><strong>Receiver Name:</strong> {generatedChallan.receiverName}</p>
        
//         </div>

//         <div className="flex justify-between">
       
//         <p><strong>Vehicle Number:</strong> {generatedChallan.vehicleNo}</p>
//        <p><strong>Mobile Number:</strong> {generatedChallan.mobileNo}</p>
       
//        </div>
        
       
        
//         <p><strong>Driver Name:</strong> {generatedChallan.driverName}</p>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="py-2 px-2 border">Item No</th>
//               <th className="py-2 px-2 border">Description</th>
//               <th className="py-2 px-2 border">Quantity</th>
//               <th className="py-2 px-2 border">Rate</th>
//               <th className="py-2 px-2 border">Amount</th>

              
             
//             </tr>
//           </thead>
//           <tbody>
//             {generatedChallan.items.map((item, index) => (
//               <tr key={index} className="border">
//                 <td className="py-2 px-2 border">{index + 1}</td>
//                 <td className="py-2 px-2 border">{item.description}</td>
//                 <td className="py-2 px-2 border">{item.quantity}</td>
//                 <td className="py-2 px-2 border">{item.rate}</td>
//                 <td className="py-2 px-2 border">{item.amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="text-right">
//           <p><strong>Delivery Charge:</strong> ₹ {generatedChallan.deliveryCharge === 0 ? 'Free' : generatedChallan.deliveryCharge}</p>
//           <p><strong>Total Amount:</strong> ₹ {generatedChallan.totalAmount}</p>
//           {/* <br /> */}
          
//         </div>
// {/* Issuing and Receiver Signature Section */}
// <div className="flex justify-between mt-4">
//           <p>Authority Signature......................</p>
//           <p>Receiver Signature......................</p>
//         </div>
//        <br />
//       </div>
//       <div className="flex justify-end mt-4">
//         <button
//           onClick={downloadChallan}
//           className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//         >
//           <FaDownload /> Download Challan
//         </button>
//         <button
//           onClick={printChallan}
//           className="px-4 py-2 bg-purple-500 text-white rounded"
//         >
//           <FaPrint /> Print Challan
//         </button>
//         <button
//           onClick={() => setGeneratedChallan(null)}
//           className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
//         >
//           <FaTimes /> Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };
  
// export default DispatchComponent;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaDownload, FaPrint, FaTimes, FaCheck } from "react-icons/fa";
// import logo from '../../assets/logo1.png';

// const api = axios.create({
//   baseURL: "https://rewa-project.onrender.com/api",
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token.startsWith("Bearer ")
//         ? token
//         : `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const DispatchComponent = () => {
//   const [processingOrders, setProcessingOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [challanData, setChallanData] = useState({
//     userCode: "",
//     vehicleNo: "",
//     driverName: "",
//     mobileNo: "",
//     items: [],
//     receiverName: "",
//   });
//   const [isChallanValid, setIsChallanValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [generatedChallan, setGeneratedChallan] = useState(null);
//   const [showCODModal, setShowCODModal] = useState(false);
//   const [codStatus, setCodStatus] = useState("");

//   const fetchProcessingOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get("/dispatch/orders/processing");
//       setProcessingOrders(response.data?.orders || []);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Error fetching processing orders");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await api.patch(`/dispatch/orders/${orderId}/status`, { status });
//       toast.success(`Order status updated to ${status}`);
//       setProcessingOrders((prevOrders) =>
//         prevOrders
//           .map((order) =>
//             order._id === orderId ? { ...order, orderStatus: status } : order
//           )
//           .filter((order) => !["delivered", "cancelled"].includes(order.orderStatus))
//       );
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Error updating order status");
//     }
//   };

//   const updateCODPaymentStatus = async (orderId) => {
//     try {
//       // Ensure we're using the correct endpoint as defined in your backend
//       const response = await api.patch(`/dispatch/orders/${orderId}/cod-payment`, {
//         paymentStatus: codStatus,
//         notes: `Updated via dispatch interface on ${new Date().toLocaleDateString()}`
//       });
      
//       toast.success(response.data.message || "COD payment status updated successfully");
//       setProcessingOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, paymentStatus: codStatus } : order
//         )
//       );
//       setShowCODModal(false);
//       setCodStatus("");
//     } catch (error) {
//       console.error('COD Update Error:', error.response);
//       const errorMessage = error.response?.data?.error || "Error updating COD payment status";
//       toast.error(errorMessage);
//       if (error.response?.status === 404) {
//         toast.error("COD payment endpoint not found. Please check backend routing.");
//       }
//     }
//   };
//   const generateChallan = async () => {
//     try {
//       const payload = {
//         ...challanData,
//         deliveryCharge: selectedOrder.deliveryCharge || 0,
//       };
//       const response = await api.post("/dispatch/generate-challan", payload);
//       toast.success("Challan generated successfully!");
//       setGeneratedChallan({
//         ...response.data.challan,
//         deliveryCharge: payload.deliveryCharge,
//         totalAmount: response.data.challan.totalAmount + payload.deliveryCharge,
//       });
//       setShowChallanModal(false);
//     } catch (error) {
//       toast.error(error.response?.data?.error || "Error generating challan");
//     }
//   };

//   const handleOrderSelection = (order) => {
//     setSelectedOrder(order);
//     setChallanData({
//       userCode: order.user?.customerDetails?.userCode || "",
//       vehicleNo: "",
//       driverName: "",
//       mobileNo: "",
//       items: order.products.map((item) => ({
//         description: item.product?.name || "N/A",
//         quantity: item.quantity || 1,
//         rate: item.price || 0,
//         amount: (item.quantity || 1) * (item.price || 0),
//       })),
//       receiverName: order.firmName || order.user?.name || "N/A",
//       deliveryCharge: order.deliveryCharge || 0,
//     });
//     setShowChallanModal(true);
//   };

//   const handleCODSelection = (order) => {
//     if (order.paymentMethod !== "COD") {
//       toast.warning("This action is only available for COD orders");
//       return;
//     }
//     setSelectedOrder(order);
//     setCodStatus(order.paymentStatus);
//     setShowCODModal(true);
//   };

//   useEffect(() => {
//     const isValid =
//       challanData.userCode &&
//       challanData.vehicleNo &&
//       challanData.driverName &&
//       challanData.mobileNo &&
//       challanData.receiverName &&
//       challanData.items.length > 0;
//     setIsChallanValid(isValid);
//   }, [challanData]);

//   const downloadChallan = () => {
//     if (!generatedChallan) {
//       toast.warning("No challan available to download.");
//       return;
//     }
//     const element = document.getElementById("challan-content");
//     const opt = {
//       margin: 1,
//       filename: `challan_${generatedChallan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   const printChallan = () => {
//     if (!generatedChallan) {
//       toast.warning("No challan available to print.");
//       return;
//     }
//     const element = document.getElementById("challan-content");
//     const opt = {
//       margin: 1,
//       filename: `challan_${generatedChallan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).toPdf().get("pdf").then((pdf) => {
//       const blobURL = pdf.output("bloburl");
//       const newWindow = window.open(blobURL, "_blank");
//       if (newWindow) {
//         newWindow.onload = () => {
//           newWindow.document.body.style.margin = 0;
//           newWindow.document.documentElement.style.height = "100%";
//           newWindow.document.body.style.overflow = "hidden";
//         };
//       }
//     });
//   };

//   useEffect(() => {
//     fetchProcessingOrders();
//   }, []);

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <ToastContainer />
//       <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-4">
//         <h1 className="text-xl md:text-2xl font-bold text-blue-600">Dispatch Management</h1>
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
//         <h2 className="text-lg md:text-3xl font-semibold mb-4 text-blue-600">
//           Processing Orders
//         </h2>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : processingOrders.length > 0 ? (
//           <table className="w-full border-collapse divide-y divide-gray-200">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-2 border-b">Order ID</th>
//                 <th className="py-2 px-2 border-b">Firm Name</th>
//                 <th className="py-2 px-2 border-b">Type</th>
//                 <th className="py-2 px-2 border-b">Customer</th>
//                 <th className="py-2 px-2 border-b">Shipping Address</th>
//                 <th className="py-2 px-2 border-b">Order Status</th>
//                 <th className="py-2 px-2 border-b">Payment Status</th>
//                 <th className="py-2 px-2 border-b">Payment Method</th>
//                 <th className="py-2 px-2 border-b">Items</th>
//                 <th className="py-2 px-2 border-b">Delivery Charge</th>
//                 <th className="py-2 px-2 border-b">Total</th>
//                 <th className="py-2 px-2 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {processingOrders.map((order) => (
//                 <tr key={order._id} className="border">
//                   <td className="py-2 px-2 border-b">{order.orderId}</td>
//                   <td className="py-2 px-2 border-b">{order.firmName}</td>
//                   <td className="py-2 px-2 border-b">{order.type}</td>
//                   <td className="py-2 px-2 border-b">{order.user?.name}</td>
//                   <td className="py-2 px-2 border-b">{order.shippingAddress}</td>
//                   <td className="py-2 px-2 border-b text-blue-500">{order.orderStatus}</td>
//                   <td className="py-2 px-2 border-b">{order.paymentStatus}</td>
//                   <td className="py-2 px-2 border-b">{order.paymentMethod}</td>
//                   <td className="py-2 px-2 border-b">
//                     {order.products.map((item, index) => (
//                       <div key={index}>
//                         {item.product?.name}: {item.quantity}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="py-2 px-2 border-b">₹ {order.deliveryCharge || 0}</td>
//                   <td className="py-2 px-2 border-b bg-blue-500 text-white">
//                     ₹ {order.totalAmountWithDelivery || order.totalAmount}
//                   </td>
//                   <td className="py-2 px-2 border-b">
//                     <select
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="p-1 border rounded"
//                     >
//                       <option value="">Update Status</option>
//                       {["confirmed", "shipped", "delivered", "cancelled"].map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       onClick={() => handleOrderSelection(order)}
//                       className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
//                     >
//                       Generate Challan
//                     </button>
//                     {order.paymentMethod === "COD" && (
//                       <button
//                         onClick={() => handleCODSelection(order)}
//                         className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded"
//                       >
//                         Update COD
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No processing orders available.</p>
//         )}
//       </div>

//       {/* COD Payment Status Modal */}
//       {showCODModal && selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3">
//             <h2 className="text-xl font-semibold mb-4 text-blue-600">
//               Update COD Payment Status
//             </h2>
//             <div className="mb-4">
//               <label className="block text-gray-700">Order: {selectedOrder.orderId}</label>
//               <select
//                 value={codStatus}
//                 onChange={(e) => setCodStatus(e.target.value)}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="payment_received_by_driver">Received by Driver</option>
//                 <option value="cash_paid_offline">Cash Paid Offline</option>
//               </select>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowCODModal(false)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => updateCODPaymentStatus(selectedOrder._id)}
//                 className="px-4 py-2 bg-green-500 text-white rounded"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Challan Generation Modal */}
//       {showChallanModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4 text-blue-600">
//               Generate Challan
//             </h2>
//             {/* Form fields remain largely the same */}
//             <form>
//               {/* ... existing form fields ... */}
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setShowChallanModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
//                 >
//                   <FaTimes /> Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={generateChallan}
//                   disabled={!isChallanValid}
//                   className={`px-4 py-2 text-white rounded ${
//                     isChallanValid ? "bg-green-500" : "bg-gray-300 cursor-not-allowed"
//                   }`}
//                 >
//                   <FaCheck /> Generate Challan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Generated Challan Display */}
//       {generatedChallan && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/2 max-h-screen overflow-y-auto">
//             <h2 className="text-2xl font-semibold mb-4 text-blue-600">
//               Generated Challan
//             </h2>
//             <div id="challan-content" className="space-y-4">
//               {/* ... existing challan content ... */}
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={downloadChallan}
//                 className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//               >
//                 <FaDownload /> Download
//               </button>
//               <button
//                 onClick={printChallan}
//                 className="px-4 py-2 bg-purple-500 text-white rounded mr-2"
//               >
//                 <FaPrint /> Print
//               </button>
//               <button
//                 onClick={() => setGeneratedChallan(null)}
//                 className="px-4 py-2 bg-gray-500 text-white rounded"
//               >
//                 <FaTimes /> Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DispatchComponent;

import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaDownload, FaPrint, FaTimes, FaCheck, FaSync } from "react-icons/fa";
import logo from '../../assets/logo1.png';

// const api = axios.create({
//   baseURL: "https://rewa-project.onrender.com/api",
// });

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      const response = await api.get("/dispatch/orders/processing");
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
      setProcessingOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
          .filter((order) => !["shipped", "cancelled"].includes(order.orderStatus))
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating order status");
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
      console.error('COD Update Error:', error.response || error);
      const errorMessage = error.response?.data?.error || 
                          (error.response?.status === 404 
                            ? "COD payment endpoint not found on server" 
                            : "Error updating COD payment status");
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        toast.warn("Please verify the /cod-payment endpoint is implemented in the backend");
      }
    }
  };

  const generateChallan = async () => {
    try {
      const payload = { ...challanData, deliveryCharge: selectedOrder.deliveryCharge || 0 };
      const response = await api.post("/dispatch/generate-challan", payload);
      toast.success("Challan generated successfully!");
      setGeneratedChallan({
        ...response.data.challan,
        deliveryCharge: payload.deliveryCharge,
        totalAmount: response.data.challan.totalAmount + payload.deliveryCharge,
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
      mobileNo: "",
      items: order.products.map((item) => ({
        description: item.product?.name || "N/A",
        quantity: item.quantity || 1,
        rate: item.price || 0,
        amount: (item.quantity || 1) * (item.price || 0),
      })),
      receiverName: order.firmName || order.user?.name || "N/A",
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
    const isValid = Object.values(challanData).every(val => val) && challanData.items.length > 0;
    setIsChallanValid(isValid);
  }, [challanData]);

  const downloadChallan = () => {
    if (!generatedChallan) return toast.warning("No challan available to download.");
    const element = document.getElementById("challan-content");
    html2pdf().from(element).set({
      margin: 1,
      filename: `challan_${generatedChallan.invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).save();
  };

  const printChallan = () => {
    if (!generatedChallan) return toast.warning("No challan available to print.");
    const element = document.getElementById("challan-content");
    html2pdf().from(element).set({
      margin: 1,
      filename: `challan_${generatedChallan.invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).toPdf().get("pdf").then((pdf) => {
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
      
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg mb-6 transform hover:scale-[1.01] transition-all duration-300">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Dispatch Dashboard
        </h1>
        <button
          onClick={fetchProcessingOrders}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          title="Refresh Orders"
        >
          <FaSync className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
          Active Processing Orders
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : processingOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-teal-50 text-gray-700">
                  {["Order ID", "Firm Name", "Type", "Customer", "Address", "Status", "Payment", "Method", "Items", "Delivery", "Total", "Actions"].map((header) => (
                    <th key={header} className="py-3 px-4 text-left font-semibold">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processingOrders.map((order, index) => (
                  <tr key={order._id} className={`border-b hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-3 px-4">{order.orderId}</td>
                    <td className="py-3 px-4 font-medium">{order.firmName}</td>
                    <td className="py-3 px-4">{order.type}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{order.shippingAddress}</td>
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
                        <div key={i} className="text-sm">{item.product?.name}: {item.quantity}</div>
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
                <label className="block text-gray-700 mb-1">Items</label>
                {challanData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input value={item.description} readOnly className="p-2 border rounded-md bg-gray-100" />
                    <input value={item.quantity} readOnly className="p-2 border rounded-md bg-gray-100" />
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
                <img src={logo} alt="Optima Polyplast LLP Logo" className="mx-auto w-32 mb-2" />
                <h1 className="text-2xl font-bold text-gray-800">OPTIMA POLYPLAST LLP</h1>
                <p className="text-gray-600">Plot No.12,296, Industrial Road, Near Umiya Battery</p>
                <p className="text-gray-600">Mota Jalundra Industrial Zone, Derojnagar, Gandhinagar, Gujarat</p>
                <p className="text-gray-600">Phone: +919274658587 | Email: info@optimapoliplast.com</p>
                <p className="text-sm text-gray-500">ISO 9001:2015 Certified Company</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Challan No:</strong> {generatedChallan.invoiceNo}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>User Code:</strong> {generatedChallan.userCode}</p>
                <p><strong>Receiver:</strong> {generatedChallan.receiverName}</p>
                <p><strong>Vehicle No:</strong> {generatedChallan.vehicleNo}</p>
                <p><strong>Mobile:</strong> {generatedChallan.mobileNo}</p>
              </div>
              <p><strong>Driver:</strong> {generatedChallan.driverName}</p>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-teal-50">
                    <th className="py-2 px-4 border-b">No</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Qty</th>
                    <th className="py-2 px-4 border-b">Rate</th>
                    <th className="py-2 px-4 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedChallan.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-center">{index + 1}</td>
                      <td className="py-2 px-4">{item.description}</td>
                      <td className="py-2 px-4 text-center">{item.quantity}</td>
                      <td className="py-2 px-4 text-right">{item.rate}</td>
                      <td className="py-2 px-4 text-right">{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right space-y-2">
                <p><strong>Delivery Charge:</strong> ₹ {generatedChallan.deliveryCharge === 0 ? 'Free' : generatedChallan.deliveryCharge}</p>
                <p className="text-lg font-semibold"><strong>Total:</strong> ₹ {generatedChallan.totalAmount}</p>
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t">
                <p className="text-gray-600">Issuers’s Signature: ________________</p>
                <p className="text-gray-600">Receiver's Signature: ________________</p>
              </div>
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