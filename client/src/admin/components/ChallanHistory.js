// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaDownload, FaPrint, FaTimes, FaCheck, FaSearch } from "react-icons/fa";

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
//   const [searchUserCode, setSearchUserCode] = useState("");
//   const [userChallans, setUserChallans] = useState([]);

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

//   // Fetch challans by user code
//   const fetchChallansByUserCode = async (userCode) => {
//     if (!userCode) {
//       toast.warning("Please enter a user code.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await api.get(`/dispatch/challans/${userCode}`);
//       setUserChallans(response.data.challans || []);
//     } catch (error) {
//       toast.error("Error fetching challans");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle search input change
//   const handleSearchInputChange = (e) => {
//     setSearchUserCode(e.target.value);
//   };

//   // Handle search form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchChallansByUserCode(searchUserCode);
//   };

//   // Download Challan as PDF
//   const downloadChallan = (challan) => {
//     const element = document.createElement("div");
//     element.innerHTML = `
//       <p>Invoice No: ${challan.invoiceNo}</p>
//       <p>User Code: ${challan.userCode}</p>
//       <p>Vehicle Number: ${challan.vehicleNo}</p>
//       <p>Driver Name: ${challan.driverName}</p>
//       <p>Mobile Number: ${challan.mobileNo}</p>
//       <p>Receiver Name: ${challan.receiverName}</p>
//       <h3>Items</h3>
//       <ul>
//         ${challan.items.map((item, index) => `
//           <li key=${index}>
//             ${item.description} - Quantity: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}
//           </li>
//         `).join("")}
//       </ul>
//       <p>Total Amount: ₹ ${challan.totalAmount}</p>
//     `;
//     const opt = {
//       margin: 1,
//       filename: `challan_${challan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   // Print Challan
//   const printChallan = (challan) => {
//     const element = document.createElement("div");
//     element.innerHTML = `
//       <p>Invoice No: ${challan.invoiceNo}</p>
//       <p>User Code: ${challan.userCode}</p>
//       <p>Vehicle Number: ${challan.vehicleNo}</p>
//       <p>Driver Name: ${challan.driverName}</p>
//       <p>Mobile Number: ${challan.mobileNo}</p>
//       <p>Receiver Name: ${challan.receiverName}</p>
//       <h3>Items</h3>
//       <ul>
//         ${challan.items.map((item, index) => `
//           <li key=${index}>
//             ${item.description} - Quantity: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}
//           </li>
//         `).join("")}
//       </ul>
//       <p>Total Amount: ₹ ${challan.totalAmount}</p>
//     `;
//     html2pdf().from(element).toPdf().get("pdf").then((pdf) => {
//       window.open(pdf.output("bloburl"), "_blank");
//     });
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchProcessingOrders();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <ToastContainer />
//       <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
//         <h1 className="text-2xl font-bold text-blue-600">Dispatch Management</h1>
//         <form onSubmit={handleSearchSubmit} className="flex items-center">
//           <input
//             type="text"
//             placeholder="Enter User Code"
//             value={searchUserCode}
//             onChange={handleSearchInputChange}
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             <FaSearch /> Search
//           </button>
//         </form>
//       </div>

//       {/* Display User Challans */}
//       {userChallans.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-semibold mb-4 text-blue-600">
//             Generated Challans for User Code: {searchUserCode}
//           </h2>
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-4 border-b">Invoice No</th>
//                 <th className="py-2 px-4 border-b">User Code</th>
//                 <th className="py-2 px-4 border-b">Vehicle Number</th>
//                 <th className="py-2 px-4 border-b">Driver Name</th>
//                 <th className="py-2 px-4 border-b">Mobile Number</th>
//                 <th className="py-2 px-4 border-b">Receiver Name</th>
//                 <th className="py-2 px-4 border-b">Total Amount</th>
//                 <th className="py-2 px-4 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {userChallans.map((challan) => (
//                 <tr key={challan._id} className="border">
//                   <td className="py-2 px-4 border-b">{challan.invoiceNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.userCode}</td>
//                   <td className="py-2 px-4 border-b">{challan.vehicleNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.driverName}</td>
//                   <td className="py-2 px-4 border-b">{challan.mobileNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.receiverName}</td>
//                   <td className="py-2 px-4 border-b">₹ {challan.totalAmount}</td>
//                   <td className="py-2 px-4 border-b">
//                     <button
//                       onClick={() => downloadChallan(challan)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//                     >
//                       <FaDownload /> Download
//                     </button>
//                     <button
//                       onClick={() => printChallan(challan)}
//                       className="px-4 py-2 bg-purple-500 text-white rounded"
//                     >
//                       <FaPrint /> Print
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Rest of the component (Processing Orders Table, Challan Generation Modal, etc.) */}
//       {/* ... (Keep the existing code for processing orders and challan generation) ... */}
//     </div>
//   );
// };

// export default DispatchComponent;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaDownload, FaPrint, FaSearch } from "react-icons/fa";

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
//   const [userChallans, setUserChallans] = useState([]);
//   const [searchUserCode, setSearchUserCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchChallansByUserCode = async (userCode) => {
//     if (!userCode) {
//       toast.warning("Please enter a user code.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await api.get(`/dispatch/challans/${userCode}`);
//       setUserChallans(response.data.challans || []);
//     } catch (error) {
//       toast.error("Error fetching challans");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchChallansByUserCode(searchUserCode);
//   };

//   const generateChallanHTML = (challan) => `
//     <div style="text-align: center; margin-bottom: 20px;">
//       <h1 style="font-size: 24px; font-weight: bold;">Optimapoliplast</h1>
//       <p>Industrial Plastic Solutions</p>
//       <p>123 Industrial Zone, City, Country</p>
//       <p>Phone: +123456789 | Email: info@optimapoliplast.com</p>
//     </div>
//     <div style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">
//       <p><strong>Challan No:</strong> ${challan.invoiceNo}</p>
//       <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
//       <p><strong>Customer:</strong> ${challan.receiverName}</p>
//       <p><strong>Vehicle No:</strong> ${challan.vehicleNo}</p>
//       <p><strong>Driver Name:</strong> ${challan.driverName}</p>
//       <p><strong>Mobile No:</strong> ${challan.mobileNo}</p>
//     </div>
//     <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
//       <thead>
//         <tr>
//           <th style="border: 1px solid #ddd; padding: 8px;">Item No</th>
//           <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
//           <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//           <th style="border: 1px solid #ddd; padding: 8px;">Unit</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${challan.items.map(
//           (item, index) => `
//             <tr>
//               <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
//               <td style="border: 1px solid #ddd; padding: 8px;">${item.unit}</td>
//             </tr>
//           `
//         ).join("")}
//       </tbody>
//     </table>
//     <div style="margin-top: 30px; display: flex; justify-content: space-between;">
//       <div>
//         <p>Prepared By:</p>
//         <p style="margin-top: 40px; border-top: 1px solid #000; width: 150px; text-align: center;">Signature</p>
//       </div>
//       <div>
//         <p>Received By:</p>
//         <p style="margin-top: 40px; border-top: 1px solid #000; width: 150px; text-align: center;">Signature</p>
//       </div>
//     </div>
//   `;

//   const downloadChallan = (challan) => {
//     const element = document.createElement("div");
//     element.innerHTML = generateChallanHTML(challan);
//     const opt = {
//       margin: 10,
//       filename: `challan_${challan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   const printChallan = (challan) => {
//     const newWindow = window.open("", "_blank");
//     newWindow.document.write("<html><head><title>Challan</title></head><body>");
//     newWindow.document.write(generateChallanHTML(challan));
//     newWindow.document.write("</body></html>");
//     newWindow.document.close();
//     newWindow.print();
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <ToastContainer />
//       <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
//         <h1 className="text-2xl font-bold text-blue-600">Dispatch Management</h1>
//         <form onSubmit={handleSearchSubmit} className="flex items-center">
//           <input
//             type="text"
//             placeholder="Enter User Code"
//             value={searchUserCode}
//             onChange={(e) => setSearchUserCode(e.target.value)}
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             <FaSearch /> Search
//           </button>
//         </form>
//       </div>
//       {userChallans.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-blue-600">Challans for User Code: {searchUserCode}</h2>
//           {userChallans.map((challan) => (
//             <div key={challan._id} className="border p-4 rounded-lg mb-4">
//               <p><strong>Invoice No:</strong> {challan.invoiceNo}</p>
//               <p><strong>Receiver:</strong> {challan.receiverName}</p>
//               <div className="flex gap-4 mt-2">
//                 <button onClick={() => downloadChallan(challan)} className="px-4 py-2 bg-blue-500 text-white rounded">
//                   <FaDownload /> Download
//                 </button>
//                 <button onClick={() => printChallan(challan)} className="px-4 py-2 bg-purple-500 text-white rounded">
//                   <FaPrint /> Print
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DispatchComponent;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaDownload, FaPrint, FaSearch } from "react-icons/fa";
// import logo from '../../assets/logo1.png'

// // Axios instance with authentication interceptor
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
//   const [userChallans, setUserChallans] = useState([]);
//   const [searchUserCode, setSearchUserCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

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

//   // Fetch challans by user code
//   const fetchChallansByUserCode = async (userCode) => {
//     if (!userCode) {
//       toast.warning("Please enter a user code.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await api.get(`/dispatch/challans/${userCode}`);
//       setUserChallans(response.data.challans || []);
//     } catch (error) {
//       toast.error("Error fetching challans");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle search input change
//   const handleSearchInputChange = (e) => {
//     setSearchUserCode(e.target.value);
//   };

//   // Handle search form submission
//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchChallansByUserCode(searchUserCode);
//   };

//   // Download Challan as PDF
//   const downloadChallan = (challan) => {
//     const element = document.createElement("div");
//     element.innerHTML = getChallanHTML(challan);
//     const opt = {
//       margin: 0.5,
//       filename: `challan_${challan.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };
//     html2pdf().from(element).set(opt).save();
//   };

//   // Print Challan
//   const printChallan = (challan) => {
//     const element = document.createElement("div");
//     element.innerHTML = getChallanHTML(challan);
//     html2pdf().from(element).toPdf().get("pdf").then((pdf) => {
//       window.open(pdf.output("bloburl"), "_blank");
//     });
//   };

//   // Generates HTML structure for the Challan
//   const getChallanHTML = (challan) => {
//     return `
//       <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
//         <div style="text-align: center;">
//           <img src=${logo} alt="Optima Polyplast LLP Logo" style="width: 150px; height: 100px; margin-bottom: 10px; justify-content: center; align-item: center;">
//           <h2>OPTIMA POLYPLAST LLP</h2>
//           <p>Plot No. 12, 296, Industrial Road, Near Umiya Battery, Mota Jalundra Industrial Zone, Derojnagar, Gandhinagar, Gujarat, India</p>
//           <p>Phone:+91 9274658587 | Email: info@optimapoliplast.com</p>
//           <p>ISO 9001:2015 Certified Company</p>
//           <br>
//         </div>
     
       
       
//         <div>
//           <p><strong>Challan No:</strong> ${challan.invoiceNo}</p> <br>
//           <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p> <br>
//           <p><strong>User Code:</strong> ${challan.userCode}</p><br>
//           <p><strong>Vehicle Number:</strong> ${challan.vehicleNo}</p><br>
//           <p><strong>Driver Name:</strong> ${challan.driverName}</p><br>
//           <p><strong>Mobile Number:</strong> ${challan.mobileNo}</p><br>
//           <p><strong>Receiver Name:</strong> ${challan.receiverName}</p><br>
//         </div><br>
//         <table border="1" style="width: 100%; margin-top: 10px; text-align: left;">
//           <tr>
//             <th>Item No</th>
//             <th>Description</th>
//             <th>Quantity</th>
//             <th>Rate</th>
//             <th>Amount</th>
//           </tr>
//           ${challan.items
//             .map(
//               (item, index) =>
//                 `<tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.rate}</td>
//                   <td>${item.amount}</td>
//                 </tr>`
//             )
//             .join("")}
//         </table>
//         <br>
//         <p style="text-align: right; font-weight: bold;">Total Amount: ₹ ${challan.totalAmount}</p>
//       </div>
//     `;
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchProcessingOrders();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <ToastContainer />
//       <div className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg mb-6">
//         <h1 className="text-2xl font-bold text-blue-600">Dispatch Management</h1>
//         <form onSubmit={handleSearchSubmit} className="flex items-center">
//           <input
//             type="text"
//             placeholder="Enter User Code"
//             value={searchUserCode}
//             onChange={handleSearchInputChange}
//             className="p-2 border rounded"
//           />
//           <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
//             <FaSearch /> Search
//           </button>
//         </form>
//       </div>

//       {/* Display User Challans */}
//       {userChallans.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-semibold mb-4 text-blue-600">
//             Generated Challans for User Code: {searchUserCode}
//           </h2>
//           <table className="w-full border-collapse">
           
//                    <tr className="bg-gray-200">
                    
//                  <th className="py-2 px-4 border-b">Invoice No</th>
//                  <th className="py-2 px-4 border-b">User Code</th>
//                  <th className="py-2 px-4 border-b">Vehicle Number</th>
//                  <th className="py-2 px-4 border-b">Driver Name</th>
//                  <th className="py-2 px-4 border-b">Mobile Number</th>
//                  <th className="py-2 px-4 border-b">Receiver Name</th>
//                  <th className="py-2 px-4 border-b">Total Amount</th>
//                  <th className="py-2 px-4 border-b">Actions</th>
//                </tr>
//              {/* </thead> */}
//             <tbody>
//               {userChallans.map((challan) => (
//                 <tr key={challan._id} className="border">
//                   <td className="py-2 px-4 border-b">{challan.invoiceNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.userCode}</td>
//                   <td className="py-2 px-4 border-b">{challan.vehicleNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.driverName}</td>
//                   <td className="py-2 px-4 border-b">{challan.mobileNo}</td>
//                   <td className="py-2 px-4 border-b">{challan.receiverName}</td>
//                   <td className="py-2 px-4 border-b">₹ {challan.totalAmount}</td>
//                   <td className="py-2 px-4 border-b">
//                     <button onClick={() => downloadChallan(challan)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
//                       <FaDownload /> Download
//                     </button>
//                     <button onClick={() => printChallan(challan)} className="px-4 py-2 bg-purple-500 text-white rounded">
//                       <FaPrint /> Print
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
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
import { FaDownload, FaPrint, FaSearch } from "react-icons/fa";
import logo from '../../assets/logo1.png'

// Axios instance with authentication interceptor
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
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
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
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  // Print Challan
  const printChallan = (challan) => {
    const element = document.createElement("div");
    element.innerHTML = getChallanHTML(challan);
    html2pdf().from(element).toPdf().get("pdf").then((pdf) => {
      window.open(pdf.output("bloburl"), "_blank");
    });
  };

  // Generates HTML structure for the Challan
  const getChallanHTML = (challan) => {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
        <div style="text-align: center;">
          <img src=${logo} alt="Optima Polyplast LLP Logo" style="width: 150px; height: 100px; margin-bottom: 10px;">
          <h2>OPTIMA POLYPLAST LLP</h2>
          <p>Plot No. 12, 296, Industrial Road, Near Umiya Battery, Mota Jalundra Industrial Zone, Derojnagar, Gandhinagar, Gujarat, India</p>
          <p>Phone:+91 9274658587 | Email: info@optimapoliplast.com</p>
          <p>ISO 9001:2015 Certified Company</p>
          <br>
        </div>
        <div>
          <p><strong>Challan No:</strong> ${challan.invoiceNo}</p><br>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><br>
          <p><strong>User Code:</strong> ${challan.userCode}</p><br>
          <p><strong>Vehicle Number:</strong> ${challan.vehicleNo}</p><br>
          <p><strong>Driver Name:</strong> ${challan.driverName}</p><br>
          <p><strong>Mobile Number:</strong> ${challan.mobileNo}</p><br>
          <p><strong>Receiver Name:</strong> ${challan.receiverName}</p><br>
        </div><br>
        <table border="1" style="width: 100%; margin-top: 10px; text-align: left;">
          <tr>
            <th>Item No</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
          ${challan.items
            .map(
              (item, index) =>
                `<tr>
                  <td>${index + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${item.rate}</td>
                  <td>${item.amount}</td>
                </tr>`
            )
            .join("")}
        </table>
        <br>
        <p style="text-align: right; font-weight: bold;">Total Amount: ₹ ${challan.totalAmount}</p>
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
                {/* <th className="py-2 px-4 border-b">Delivery Charge</th> */}
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
                  {/* <td className="py-2 px-4 border-b">{challan.deliveryCharge}</td> */}
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
