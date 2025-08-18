// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Sidebar from "../../admin/components/sidebar";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// const BannerManagement = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [toastMessage, setToastMessage] = useState(null);
//   const [bannerImage, setBannerImage] = useState(null);
//   const navigate = useNavigate();
  

//   const fetchBanners = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/admin/banners");
//       setBanners(response.data.banners);
//       setError(null);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       if (err.response?.status === 401) {
//         setError("Session expired. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError("Failed to load banners. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setToastMessage({
//         message: "Authorization token missing or expired.",
//         type: "error",
//       });
//       navigate("/login");
//       return;
//     }

//     if (!bannerImage) {
//       setToastMessage({
//         message: "Please select a banner image.",
//         type: "error",
//       });
//       return;
//     }

//     const fileType = bannerImage.type.split("/")[0];
//     if (fileType !== "image") {
//       setToastMessage({
//         message: "Uploaded file must be an image.",
//         type: "error",
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", bannerImage); // Match backend's expected field name

//     try {
//       const response = await api.post("/admin/banners", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setToastMessage({
//         message: response.data.message,
//         type: "success",
//       });
//       fetchBanners();
//       setIsModalOpen(false);
//       setBannerImage(null);
//     } catch (error) {
//       console.error("Upload Error:", error.response || error);
//       let errorMessage = "Failed to upload banner.";
//       if (error.response) {
//         if (error.response.status === 500) {
//           errorMessage = "Server error occurred. Please try again later.";
//         } else if (error.response.status === 400) {
//           errorMessage = error.response.data.error || "Invalid request.";
//         } else if (error.response.status === 401) {
//           errorMessage = "Unauthorized. Redirecting to login...";
//           setTimeout(() => navigate("/login"), 2000);
//         }
//       }
//       setToastMessage({
//         message: errorMessage,
//         type: "error",
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this banner?")) {
//       try {
//         const response = await api.delete(`/admin/banners/${id}`);
//         setToastMessage({
//           message: response.data.message,
//           type: "success",
//         });
//         fetchBanners();
//       } catch (error) {
//         console.error("Delete Error:", error);
//         setToastMessage({
//           message: "Failed to delete banner.",
//           type: "error",
//         });
//       }
//     }
//   };

//   const closeToast = () => {
//     setToastMessage(null);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="flex">
//       <div className="w-64 bg-gray-800 text-white h-screen">
//         <Sidebar />
//       </div>

//       <div className="flex-1 p-4 rounded-3xl">
//         <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl mt-6">
//           <div className="flex items-center justify-between p-6 border-b bg-blue-700">
//             <h1 className="text-3xl text-white">Banner Management</h1>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200"
//             >
//               ➕ Add New Banner
//             </button>
//           </div>

//           <div className="overflow-x-auto p-6">
//             <table className="table-auto w-full text-lg text-left border-collapse">
//               <thead>
//                 <tr>
//                   <th className="px-4 py-2">Image</th>
//                   <th className="px-4 py-2">Order</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {banners.map((banner) => (
//                   <tr key={banner._id} className="border-t">
//                     <td className="px-4 py-2">
//                       <img
//                         src={banner.image}
//                         alt={`Banner ${banner.order}`}
//                         className="w-24 h-16 object-cover rounded"
//                       />
//                     </td>
//                     <td className="px-4 py-2">{banner.order}</td>
//                     <td className="px-4 py-2">
//                       {banner.isActive ? "Active" : "Inactive"}
//                     </td>
//                     <td className="px-4 py-2">
//                       <button
//                         onClick={() => handleDelete(banner._id)}
//                         className="ml-0 text-red-500 bg-red-200 hover:bg-red-400 hover:text-red-700 px-3 py-2 rounded-lg"
//                       >
//                         Delete🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {banners.length === 0 && (
//               <p className="text-center text-gray-600 p-4">
//                 No banners available
//               </p>
//             )}
//           </div>

//           {toastMessage && (
//             <div
//               className={`fixed bottom-4 right-4 bg-${
//                 toastMessage.type === "success" ? "green" : "red"
//               }-500 text-white px-4 py-2 rounded-lg`}
//             >
//               {toastMessage.message}
//               <button
//                 onClick={closeToast}
//                 className="ml-4 text-sm underline"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
//             <h2 className="text-xl font-bold mb-4">Upload New Banner</h2>
//             <form onSubmit={handleUpload}>
//               <div className="mb-4">
//                 <label
//                   htmlFor="bannerImage"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Banner Image
//                 </label>
//                 <input
//                   type="file"
//                   id="bannerImage"
//                   accept="image/*"
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   onChange={(e) => setBannerImage(e.target.files[0])}
//                   required
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="mr-2 text-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//                 >
//                   Upload
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerManagement;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
      const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [zoomImage, setZoomImage] = useState(null); // Zoom image state
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/banners");
      setBanners(response.data.banners);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load banners. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    // const token = localStorage.getItem("token");
      const token = cookies.get("token");
    if (!token) {
      setToastMessage({
        message: "Authorization token missing or expired.",
        type: "error",
      });
      navigate("/login");
      return;
    }

    if (!bannerImage) {
      setToastMessage({
        message: "Please select a banner image.",
        type: "error",
      });
      return;
    }

    const fileType = bannerImage.type.split("/")[0];
    if (fileType !== "image") {
      setToastMessage({
        message: "Uploaded file must be an image.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", bannerImage);

    try {
      const response = await api.post("/admin/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setToastMessage({
        message: response.data.message,
        type: "success",
      });
      fetchBanners();
      setIsModalOpen(false);
      setBannerImage(null);
    } catch (error) {
      console.error("Upload Error:", error.response || error);
      let errorMessage = "Failed to upload banner.";
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || "Invalid request.";
        } else if (error.response.status === 401) {
          errorMessage = "Unauthorized. Redirecting to login...";
          setTimeout(() => navigate("/login"), 2000);
        }
      }
      setToastMessage({
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await api.delete(`/admin/banners/${id}`);
        setToastMessage({
          message: response.data.message,
          type: "success",
        });
        fetchBanners();
      } catch (error) {
        console.error("Delete Error:", error);
        setToastMessage({
          message: "Failed to delete banner.",
          type: "error",
        });
      }
    }
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 rounded-3xl">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl mt-6">
          <div className="flex items-center justify-between p-6 border-b bg-blue-700">
            <h1 className="text-3xl text-white">Banner Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black py-2 px-4 rounded-lg hover:bg-blue-200"
            >
              ➕ Add New Banner
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="table-auto w-full text-lg text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-t">
                    <td className="px-4 py-2">
                      <img
                        src={banner.image}
                        alt={`Banner ${banner.order}`}
                        className="w-24 h-16 object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-200"
                        onClick={() => setZoomImage(banner.image)}
                      />
                    </td>
                    <td className="px-4 py-2">{banner.order}</td>
                    <td className="px-4 py-2">
                      {banner.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="ml-0 text-red-500 bg-red-200 hover:bg-red-400 hover:text-red-700 px-3 py-2 rounded-lg"
                      >
                        Delete🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {banners.length === 0 && (
              <p className="text-center text-gray-600 p-4">
                No banners available
              </p>
            )}
          </div>

          {toastMessage && (
            <div
              className={`fixed bottom-4 right-4 bg-${
                toastMessage.type === "success" ? "green" : "red"
              }-500 text-white px-4 py-2 rounded-lg`}
            >
              {toastMessage.message}
              <button
                onClick={closeToast}
                className="ml-4 text-sm underline"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Upload New Banner</h2>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label
                  htmlFor="bannerImage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Banner Image
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  accept="image/*"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setBannerImage(e.target.files[0])}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zoom Image Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed Banner"
            className="max-w-3xl max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default BannerManagement;
