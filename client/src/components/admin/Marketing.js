// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "./sidebar";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// // import Header from "../../admin/components/Headerd";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const Marketing = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [marketingData, setMarketingData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewing, setReviewing] = useState(null);
//   const [zoomedImage, setZoomedImage] = useState(null);
//   const [filterDate, setFilterDate] = useState(null); // State for selected date
//   const navigate = useNavigate();

//   const api = axios.create({
//     baseURL: "https://rewa-project.onrender.com/api",
//   });

//   // Attach token to every request
//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization =
//           token.startsWith("Bearer ") ? token : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Handle review submission
//   const handleReview = async (activityId) => {
//     if (
//       marketingData?.activities?.some(
//         (activity) => activity._id === activityId && activity.status === "reviewed"
//       )
//     ) {
//       toast.info("This activity has already been reviewed.");
//       return;
//     }

//     setReviewing(activityId);
//     toast.info("Submitting review...");

//     try {
//       const response = await api.patch(
//         `/admin/marketing-activities/${activityId}/review`,
//         {}
//       );
      
//       if (response.status === 200) {
//         toast.success(`Review submitted successfully for activity ID: ${activityId}`);
//         setMarketingData((prevData) => ({
//           ...prevData,
//           activities: prevData.activities.map((activity) =>
//             activity._id === activityId
//               ? {
//                   ...activity,
//                   status: "reviewed",
//                   reviewedAt: new Date(),
//                   reviewedBy: response.data.activity.reviewedBy,
//                 }
//               : activity
//           ),
//         }));
//       } else {
//         toast.error("Error submitting review. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error in handleReview:", err);
//       toast.error("Error submitting review. Please try again later.");
//     } finally {
//       setReviewing(null);
//     }
//   };

//   const fetchMarketingData = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/admin/marketing-activities");
//       if (response.status === 200) {
//         setMarketingData(response.data);
//       } else {
//         setError("Error fetching marketing data. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Error fetching marketing data:", err);
//       setError("Error fetching marketing data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageClick = (image) => setZoomedImage(image);
//   const closeZoomedImage = () => setZoomedImage(null);

//   // Filter activities based on the selected date
//   const filterByDate = (date) => {
//     if (!date) return marketingData?.activities; // Show all data if no date is selected
//     return marketingData?.activities.filter((activity) =>
//       new Date(activity.reviewedAt).toLocaleDateString() === date.toLocaleDateString()
//     );
//   };

//   useEffect(() => {
//     fetchMarketingData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="flex bg-gray-100 min-h-screen flex-col">
//       {/* <Header /> */}
//       <div className="flex flex-1">
//         <Sidebar isOpen={isSidebarOpen} />
//         <ToastContainer />
//         <div className="flex-1 p-6 ml-64 flex justify-center items-start overflow-y-auto">
//           <div className="w-full max-w-6xl bg-white shadow-2xl rounded-lg p-8 space-y-6">
//             <h2 className="text-4xl font-extrabold text-left text-blue-500 mb-8">
//               Visited Shops/Companies (Marketing Activities)
//             </h2>

//             {/* Date Filter Section */}
//             <div className="flex justify-between items-center mb-6">
//               <div className="flex items-center space-x-4">
//                 <p className="font-semibold text-gray-700">Filter by Reviewed Date:</p>
//                 <DatePicker
//                   selected={filterDate}
//                   onChange={(date) => setFilterDate(date)}
//                   dateFormat="MMMM d, yyyy"
//                   placeholderText="Select a date"
//                   className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {/* Clear Filter Button */}
//                 <button
//                   onClick={() => setFilterDate(null)}
//                   className="text-sm text-red-500 hover:text-red-700 font-semibold transition duration-200"
//                 >
//                   Clear Filter
//                 </button>
//               </div>
//             </div>

//             {/* Filtered Activities */}
//             {filterByDate(filterDate)?.length === 0 ? (
//               <div className="text-center text-xl text-gray-500 py-4">
//                 No activities found for this date.
//               </div>
//             ) : (
//               filterByDate(filterDate)?.map((activity) => (
//                 <div
//                   key={activity._id}
//                   className="bg-gray-300 p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-transform transform"
//                 >
//                   <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-md space-y-4 mb-6">
//                     <div className="flex justify-between">
//                       <p className="font-semibold text-gray-700">Date:</p>
//                       <p className="text-gray-800">
//                         {activity.createdAt
//                           ? new Date(activity.createdAt).toLocaleDateString()
//                           : "N/A"}
//                       </p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="font-semibold text-gray-700">Marketing Person Name:</p>
//                       <p className="text-blue-600">{activity.marketingUser?.name}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="font-semibold text-gray-900">Email ID:</p>
//                       <p className="text-blue-700">{activity.marketingUser?.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex justify-between space-x-4 mb-6">
//                     {activity.images?.map((image, index) => (
//                       <div
//                         key={index}
//                         className="bg-gray-200 w-1/3 h-40 rounded-lg shadow-inner flex items-center justify-center cursor-pointer"
//                         onClick={() => handleImageClick(image)}
//                       >
//                         <img
//                           src={image}
//                           alt={`Activity Image ${index + 1}`}
//                           className="object-cover w-full h-full rounded-lg"
//                         />
//                       </div>
//                     ))}
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-md shadow-inner space-y-4">
//                     <div className="flex justify-start space-x-2">
//                       <p className="font-bold text-gray-900">Customer Name:</p>
//                       <p className="font-semibold text-blue-600">{activity.customerName}</p>
//                     </div>
//                     <div className="flex justify-start space-x-2">
//                       <p className="font-bold text-gray-900">Location:</p>
//                       <p className="font-bold text-red-900">{activity.location}</p>
//                     </div>
//                     {activity.reviewedAt && (
//                       <div className="flex justify-start space-x-2 mt-4">
//                         <p className="font-bold text-gray-700">Reviewed At:</p>
//                         <p className="font-bold text-red-700">
//                           {new Date(activity.reviewedAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-blue-300 p-4 rounded-md shadow-inner mt-4">
//                     <div className="flex justify-start space-x-2">
//                       <p className="font-bold text-black">Discussion:</p>
//                       <p className="font-semibold text-gray-900">{activity.discussion}</p>
//                     </div>
//                   </div>

//                   <div className="flex justify-end mt-6">
//                     {activity.status === "reviewed" ? (
//                       <button
//                         className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed"
//                         disabled
//                       >
//                         Already Reviewed
//                       </button>
//                     ) : reviewing === activity._id ? (
//                       <button
//                         className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed"
//                         disabled
//                       >
//                         Pending...
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleReview(activity._id)}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
//                       >
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}

//             {zoomedImage && (
//               <div
//                 className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
//                 onClick={closeZoomedImage}
//               >
//                 <img
//                   src={zoomedImage}
//                   alt="Zoomed"
//                   className="max-w-full max-h-full rounded-lg"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Marketing;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "./sidebar";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const Marketing = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [marketingData, setMarketingData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviewing, setReviewing] = useState(null);
//   const [zoomedImage, setZoomedImage] = useState(null);
//   const [filterDate, setFilterDate] = useState(null);
//   const navigate = useNavigate();

//   const api = axios.create({
//     baseURL: "https://rewa-project.onrender.com/api",
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   const handleReview = async (activityId) => {
//     if (marketingData?.activities?.some((activity) => activity._id === activityId && activity.status === "reviewed")) {
//       toast.info("This activity has already been reviewed.");
//       return;
//     }

//     setReviewing(activityId);
//     toast.info("Submitting review...");

//     try {
//       const response = await api.patch(`/admin/marketing-activities/${activityId}/review`, {});
//       if (response.status === 200) {
//         toast.success(`Review submitted successfully for activity ID: ${activityId}`);
//         setMarketingData((prevData) => ({
//           ...prevData,
//           activities: prevData.activities.map((activity) =>
//             activity._id === activityId
//               ? {
//                   ...activity,
//                   status: "reviewed",
//                   reviewedAt: new Date(),
//                   reviewedBy: response.data.activity.reviewedBy,
//                 }
//               : activity
//           ),
//         }));
//       }
//     } catch (err) {
//       console.error("Error in handleReview:", err);
//       toast.error("Error submitting review. Please try again later.");
//     } finally {
//       setReviewing(null);
//     }
//   };

//   const fetchMarketingData = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/admin/marketing-activities");
//       if (response.status === 200) {
//         setMarketingData(response.data);
//       } else {
//         setError("Error fetching marketing data. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Error fetching marketing data:", err);
//       setError("Error fetching marketing data. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageClick = (image) => setZoomedImage(image);
//   const closeZoomedImage = () => setZoomedImage(null);

//   const filterByDate = (date) => {
//     if (!date) return marketingData?.activities;
//     return marketingData?.activities.filter((activity) =>
//       new Date(activity.createdAt).toLocaleDateString() === date.toLocaleDateString()
//     );
//   };

//   useEffect(() => {
//     fetchMarketingData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="flex bg-gray-100 min-h-screen flex-col">
//       <div className="flex flex-1">
//         <Sidebar isOpen={isSidebarOpen} />
//         <ToastContainer />
//         <div className="flex-1 p-6 ml-64 flex justify-center items-start overflow-y-auto">
//           <div className="w-full max-w-6xl bg-white shadow-2xl rounded-lg p-8 space-y-6">
//             <h2 className="text-4xl font-extrabold text-left text-blue-500 mb-8">
//               Marketing Activities
//             </h2>

//             <div className="flex justify-between items-center mb-6">
//               <div className="flex items-center space-x-4">
//                 <p className="font-semibold text-gray-700">Filter by Created Date:</p>
//                 <DatePicker
//                   selected={filterDate}
//                   onChange={(date) => setFilterDate(date)}
//                   dateFormat="MMMM d, yyyy"
//                   placeholderText="Select a date"
//                   className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   onClick={() => setFilterDate(null)}
//                   className="text-sm text-red-500 hover:text-red-700 font-semibold transition duration-200"
//                 >
//                   Clear Filter
//                 </button>
//               </div>
//             </div>

//             {filterByDate(filterDate)?.length === 0 ? (
//               <div className="text-center text-xl text-gray-500 py-4">
//                 No activities found for this date.
//               </div>
//             ) : (
//               filterByDate(filterDate)?.map((activity) => (
//                 <div
//                   key={activity._id}
//                   className="bg-gray-50 p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-transform transform"
//                 >
//                   {/* Marketing User and Date Info */}
//                   <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
//                     <div>
//                       <p className="font-semibold text-gray-700">Marketing Person:</p>
//                       <p className="text-blue-600">{activity.marketingUser?.name || "N/A"}</p>
//                       <p className="text-blue-700">{activity.marketingUser?.email || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-700">Created:</p>
//                       <p>{new Date(activity.createdAt).toLocaleString()}</p>
//                       {activity.reviewedAt && (
//                         <>
//                           <p className="font-semibold text-gray-700 mt-2">Reviewed:</p>
//                           <p>{new Date(activity.reviewedAt).toLocaleString()}</p>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Customer and Activity Details */}
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="font-bold">Customer Name:</p>
//                       <p className="text-blue-600">{activity.customerName}</p>
//                       <p className="font-bold mt-2">Mobile:</p>
//                       <p>{activity.customerMobile}</p>
//                     </div>
//                     <div>
//                       <p className="font-bold">Location:</p>
//                       <p className="text-red-900">{activity.location}</p>
//                       <p className="font-bold mt-2">Visit Type:</p>
//                       <p className="capitalize">
//                         {activity.visitType ? activity.visitType.replace("_", " ") : "N/A"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Discussion and Additional Info */}
//                   <div className="bg-blue-50 p-4 rounded-md mb-4">
//                     <p className="font-bold text-black">Discussion:</p>
//                     <p className="text-gray-900">{activity.discussion}</p>
//                     {activity.inquiryType && (
//                       <>
//                         <p className="font-bold mt-2">Inquiry Type:</p>
//                         <p>{activity.inquiryType}</p>
//                       </>
//                     )}
//                     {activity.remarks && (
//                       <>
//                         <p className="font-bold mt-2">Remarks:</p>
//                         <p>{activity.remarks}</p>
//                       </>
//                     )}
//                   </div>

//                   {/* Images */}
//                   {activity.images?.length > 0 && (
//                     <div className="flex flex-wrap gap-4 mb-4">
//                       {activity.images.map((image, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-200 w-32 h-32 rounded-lg shadow-inner flex items-center justify-center cursor-pointer"
//                           onClick={() => handleImageClick(image)}
//                         >
//                           <img
//                             src={image}
//                             alt={`Activity Image ${index + 1}`}
//                             className="object-cover w-full h-full rounded-lg"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Status and Review Button */}
//                   <div className="flex justify-between items-center">
//                     <p className="font-semibold">
//                       Status:{" "}
//                       <span className={`capitalize ${activity.status === 'reviewed' ? 'text-green-600' : 'text-yellow-600'}`}>
//                         {activity.status}
//                       </span>
//                     </p>
//                     {activity.status === "reviewed" ? (
//                       <button className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed" disabled>
//                         Already Reviewed
//                       </button>
//                     ) : reviewing === activity._id ? (
//                       <button className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed" disabled>
//                         Pending...
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleReview(activity._id)}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
//                       >
//                         Review
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}

//             {zoomedImage && (
//               <div
//                 className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
//                 onClick={closeZoomedImage}
//               >
//                 <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-lg" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Marketing;



import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cookies from 'js-cookie';

const Marketing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [marketingData, setMarketingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const navigate = useNavigate();

  // const api = axios.create({
  //   baseURL: "https://rewa-project.onrender.com/api",
  // });

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

  const handleReview = async (activityId) => {
    if (marketingData?.activities?.some((activity) => activity._id === activityId && activity.status === "reviewed")) {
      toast.info("This activity has already been reviewed.");
      return;
    }

    setReviewing(activityId);
    toast.info("Submitting review...");

    try {
      const response = await api.patch(`/admin/marketing-activities/${activityId}/review`, {});
      if (response.status === 200) {
        toast.success(`Review submitted successfully for activity ID: ${activityId}`);
        setMarketingData((prevData) => ({
          ...prevData,
          activities: prevData.activities.map((activity) =>
            activity._id === activityId
              ? {
                  ...activity,
                  status: "reviewed",
                  reviewedAt: new Date(),
                  reviewedBy: response.data.activity.reviewedBy,
                }
              : activity
          ),
        }));
      }
    } catch (err) {
      console.error("Error in handleReview:", err);
      toast.error("Error submitting review. Please try again later.");
    } finally {
      setReviewing(null);
    }
  };

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/marketing-activities");
      if (response.status === 200) {
        setMarketingData(response.data);
      } else {
        setError("Error fetching marketing data. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching marketing data:", err);
      setError("Error fetching marketing data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('admin/download-marketing-activities', {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Marketing_Activities.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Marketing activities downloaded successfully!");
    } catch (err) {
      console.error("Error downloading marketing activities:", err);
      toast.error("Error downloading marketing activities. Please try again.");
    }
  };

  const handleImageClick = (image) => setZoomedImage(image);
  const closeZoomedImage = () => setZoomedImage(null);

  const filterByDate = (date) => {
    if (!date) return marketingData?.activities;
    return marketingData?.activities.filter((activity) =>
      new Date(activity.createdAt).toLocaleDateString() === date.toLocaleDateString()
    );
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        <ToastContainer />
        <div className="flex-1 p-6 ml-64 flex justify-center items-start overflow-y-auto">
          <div className="w-full max-w-6xl bg-white shadow-2xl rounded-lg p-8 space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-extrabold text-left text-blue-500">
                Marketing Activities
              </h2>
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-green-700 hover:to-emerald-700 transition duration-200 ease-in-out transform hover:scale-105"
              >
                Download All Activities
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <p className="font-semibold text-gray-700">Filter by Created Date:</p>
                <DatePicker
                  selected={filterDate}
                  onChange={(date) => setFilterDate(date)}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date"
                  className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setFilterDate(null)}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold transition duration-200"
                >
                  Clear Filter
                </button>
              </div>
            </div>

            {filterByDate(filterDate)?.length === 0 ? (
              <div className="text-center text-xl text-gray-500 py-4">
                No activities found for this date.
              </div>
            ) : (
              filterByDate(filterDate)?.map((activity) => (
                <div
                  key={activity._id}
                  className="bg-gray-50 p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-transform transform"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                    <div>
                      <p className="font-semibold text-gray-700">Marketing Person:</p>
                      <p className="text-blue-600">{activity.marketingUser?.name || "N/A"}</p>
                      <p className="text-blue-700">{activity.marketingUser?.email || "N/A"}</p>
                      <p className="font-semibold text-gray-700 mt-2">Firm Name:</p>
                      <p>{activity.marketingUser?.customerDetails?.firmName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Created:</p>
                      <p>{new Date(activity.createdAt).toLocaleString()}</p>
                      {activity.reviewedAt && (
                        <>
                          <p className="font-semibold text-gray-700 mt-2">Reviewed:</p>
                          <p>{new Date(activity.reviewedAt).toLocaleString()}</p>
                          <p className="font-semibold text-gray-700 mt-2">Reviewed By:</p>
                          <p>{activity.reviewedBy || "N/A"}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-bold">Customer Name:</p>
                      <p className="text-blue-600">{activity.customerName}</p>
                      <p className="font-bold mt-2">Mobile:</p>
                      <p>{activity.customerMobile}</p>
                    </div>
                    <div>
                      <p className="font-bold">Location:</p>
                      <p className="text-red-900">{activity.location}</p>
                      <p className="font-bold mt-2">Visit Type:</p>
                      <p className="capitalize">
                        {activity.visitType ? activity.visitType.replace("_", " ") : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="font-bold text-black">Discussion:</p>
                    <p className="text-gray-900">{activity.discussion}</p>
                    {activity.inquiryType && (
                      <>
                        <p className="font-bold mt-2">Inquiry Type:</p>
                        <p>{activity.inquiryType}</p>
                      </>
                    )}
                    {activity.remarks && (
                      <>
                        <p className="font-bold mt-2">Remarks:</p>
                        <p>{activity.remarks}</p>
                      </>
                    )}
                  </div>

                  {activity.images?.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {activity.images.map((image, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 w-32 h-32 rounded-lg shadow-inner flex items-center justify-center cursor-pointer"
                          onClick={() => handleImageClick(image)}
                        >
                          <img
                            src={image}
                            alt={`Activity Image ${index + 1}`}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      Status:{" "}
                      <span className={`capitalize ${activity.status === 'reviewed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {activity.status}
                      </span>
                    </p>
                    {activity.status === "reviewed" ? (
                      <button className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed" disabled>
                        Already Reviewed
                      </button>
                    ) : reviewing === activity._id ? (
                      <button className="bg-gray-500 text-white py-2 px-6 rounded-lg shadow-md cursor-not-allowed" disabled>
                        Pending...
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReview(activity._id)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 transition duration-200 ease-in-out transform hover:scale-105"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {zoomedImage && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
                onClick={closeZoomedImage}
              >
                <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;