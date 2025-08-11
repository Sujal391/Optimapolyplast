// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Sidebar from "../sidebar";
// import useWindowSize from "../../store/useWindowSize";
// import LoadingSpinner from "../LoadingSpinner";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "../UI/Table";

// const Attendance = () => {
//   const { isOpen, isMobile, setIsOpen } = useWindowSize();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [attendanceData, setAttendanceData] = useState({
//     attendance: [],
//     summary: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0], // Default to 7 days back
//     endDate: new Date().toISOString().split("T")[0],
//     panel: "",
//     includeImages: false,
//   });
//   const [zoomedInImage, setZoomedInImage] = useState(null); // State for the zoomed-in image

//   // const api = axios.create({ baseURL: "https://rewa-project.onrender.com/api" });

//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API,
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) config.headers.Authorization = token;
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Fetch attendance data when filters change
//   useEffect(() => {
//     fetchAttendance();
//   }, [filters]);

//   const fetchAttendance = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const queryParams = Object.fromEntries(
//         Object.entries(filters).filter(
//           ([_, value]) => value !== "" && value !== null
//         )
//       );

//       const response = await api.get("/admin/attendance", {
//         params: queryParams,
//       });
//       setAttendanceData(response.data);
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           error.response?.data?.error ||
//           "Error fetching attendance data"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const openImageModal = (imageUrl) => {
//     setZoomedInImage(imageUrl);
//   };

//   const closeImageModal = () => {
//     setZoomedInImage(null);
//   };

//   if (error) {
//     return (
//       <div className=" items-center justify-center min-h-screen">
//         <div className="text-red-600 text-center">
//           <p className="text-lg font-semibold mb-2">Error</p>
//           <p>{error}</p>
//           <button
//             onClick={fetchAttendance}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-lg font-semibold">
//           <LoadingSpinner />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex">
//       {/* Sidebar */}

//       <Sidebar
//         isOpen={isOpen}
//         isMobile={isMobile}
//         toggleSidebar={() => setIsOpen((prev) => !prev)}
//       />

//       {/* Main Content */}
//       <div className="flex-1 p-6 max-w-7xl mx-auto w-full md:(min-width:768px) sm:(min-width:640px) md:p2 md:text-base sm-p1 sm-text-sm flex justify-center items-center overflow-hidden">
//         <h1 className="text-3xl font-bold mb-6">Attendance Dashboard</h1>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-300 p-4 rounded-lg">
//           <div>
//             <label className="block text-lg font-medium mb-1">Start Date</label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-lg font-medium mb-1">End Date</label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-lg font-medium mb-1">Panel</label>
//             <select
//               name="panel"
//               value={filters.panel}
//               onChange={handleFilterChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">All Panels</option>
//               <option value="reception">Reception</option>
//               <option value="marketing">Marketing</option>
//               <option value="stock">Stock</option>
//               <option value="dispatch">Dispatch</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-lg font-medium mb-1">
//               Include Images
//             </label>
//             <select
//               name="includeImages"
//               value={filters.includeImages}
//               onChange={handleFilterChange}
//               className="w-full p-2 border rounded"
//             >
//               <option value={false}>No</option>
//               <option value={true}>Yes</option>
//             </select>
//           </div>
//         </div>

//         {/* Summary Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-blue-200 p-4 rounded-lg">
//             <h3 className="text-lg font-medium text-blue-800">Total Records</h3>
//             <p className="text-2xl font-bold text-blue-900">
//               {attendanceData.summary.totalRecords}
//             </p>
//           </div>
//           <div className="bg-green-200 p-4 rounded-lg">
//             <h3 className="text-lg font-medium text-green-800">Total Hours</h3>
//             <p className="text-2xl font-bold text-green-900">
//               {attendanceData.summary.totalHours?.toFixed(2)}
//             </p>
//           </div>
//           <div className="bg-purple-200 p-4 rounded-lg">
//             <h3 className="text-lg font-medium text-purple-800">
//               Average Hours/Day
//             </h3>
//             <p className="text-2xl font-bold text-purple-900">
//               {attendanceData.summary.averageHoursPerDay?.toFixed(2)}
//             </p>
//           </div>
//           <div className="bg-yellow-200 p-4 rounded-lg">
//             <h3 className="text-lg font-medium text-yellow-800">
//               Active Panels
//             </h3>
//             <p className="text-2xl font-bold text-yellow-900">
//               {Object.keys(attendanceData.summary.byPanel || {}).length}
//             </p>
//           </div>
//         </div>

//         {/* Attendance Table - Responsive like Users.js and Order.js */}
//         {/* <div className="w-full overflow-x-hidden bg-white rounded-xl shadow">
//           <table className="w-full table-fixed text-xs sm:text-sm border-collapse">
//             <thead className="bg-indigo-500">
//               <tr>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   User
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Panel
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Date
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Check In
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Check Out
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Hours
//                 </th>
//                 <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                   Status
//                 </th>
//                 {filters.includeImages && (
//                   <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-white font-semibold">
//                     Image
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendanceData.attendance.map((record, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="px-2 py-2 truncate max-w-[120px]">
//                     <div className="font-medium text-gray-900 truncate">
//                       {record.user?.name}
//                     </div>
//                     <div className="text-blue-500 truncate">
//                       {record.user?.email}
//                     </div>
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[80px]">
//                     <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-300 text-blue-800">
//                       {record.panel}
//                     </span>
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[80px] text-gray-900">
//                     {new Date(record.selectedDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[80px] text-red-500 font-semibold">
//                     {new Date(record.checkInTime).toLocaleTimeString()}
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[80px] text-red-500 font-semibold">
//                     {record.checkOutTime
//                       ? new Date(record.checkOutTime).toLocaleTimeString()
//                       : "-"}
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[60px] text-blue-500 font-semibold">
//                     {record.totalHours?.toFixed(2)}
//                   </td>
//                   <td className="px-2 py-2 truncate max-w-[80px]">
//                     <span
//                       className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
//                         record.status === "checked-out"
//                           ? "bg-green-400 text-green-900"
//                           : "bg-yellow-300 text-yellow-900"
//                       }`}
//                     >
//                       {record.status}
//                     </span>
//                   </td>
//                   {filters.includeImages && (
//                     <td className="px-2 py-2 truncate max-w-[60px]">
//                       {record.checkInImage ? (
//                         <img
//                           src={record.checkInImage}
//                           alt="Check-in"
//                           className="h-8 w-8 rounded cursor-pointer object-cover"
//                           onClick={() => openImageModal(record.checkInImage)}
//                         />
//                       ) : (
//                         <span className="text-gray-500">-</span>
//                       )}
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div> */}

//         <div className="w-full table-fixed text-xs sm:text-sm">
//           <Table className="table-fixed text-xs sm:text-sm border-collapse">
//             <TableHeader>
//               <TableRow className="bg-indigo-500">
//                 <TableHead className="text-white">User</TableHead>
//                 <TableHead className="text-white">Panel</TableHead>
//                 <TableHead className="text-white">Date</TableHead>
//                 <TableHead className="text-white">Check In</TableHead>
//                 <TableHead className="text-white">Check Out</TableHead>
//                 <TableHead className="text-white">Hours</TableHead>
//                 <TableHead className="text-white">Status</TableHead>
//                 {filters.includeImages && (
//                   <TableHead className="text-white">Image</TableHead>
//                 )}
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {attendanceData.attendance.map((record, index) => (
//                 <TableRow key={index} className="hover:bg-gray-50">
//                   <TableCell className="truncate max-w-[120px]">
//                     <div className="font-medium text-gray-900 truncate">
//                       {record.user?.name}
//                     </div>
//                     <div className="text-blue-500 truncate">
//                       {record.user?.email}
//                     </div>
//                   </TableCell>

//                   <TableCell className="truncate max-w-[80px]">
//                     <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-300 text-blue-800">
//                       {record.panel}
//                     </span>
//                   </TableCell>

//                   <TableCell className="truncate max-w-[80px] text-gray-900">
//                     {new Date(record.selectedDate).toLocaleDateString()}
//                   </TableCell>

//                   <TableCell className="truncate max-w-[80px] text-red-500 font-semibold">
//                     {new Date(record.checkInTime).toLocaleTimeString()}
//                   </TableCell>

//                   <TableCell className="truncate max-w-[80px] text-red-500 font-semibold">
//                     {record.checkOutTime
//                       ? new Date(record.checkOutTime).toLocaleTimeString()
//                       : "-"}
//                   </TableCell>

//                   <TableCell className="truncate max-w-[60px] text-blue-500 font-semibold">
//                     {record.totalHours?.toFixed(2)}
//                   </TableCell>

//                   <TableCell className="truncate max-w-[80px]">
//                     <span
//                       className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
//                         record.status === "checked-out"
//                           ? "bg-green-400 text-green-900"
//                           : "bg-yellow-300 text-yellow-900"
//                       }`}
//                     >
//                       {record.status}
//                     </span>
//                   </TableCell>

//                   {filters.includeImages && (
//                     <TableCell className="truncate max-w-[60px]">
//                       {record.checkInImage ? (
//                         <img
//                           src={record.checkInImage}
//                           alt="Check-in"
//                           className="h-8 w-8 rounded cursor-pointer object-cover"
//                           onClick={() => openImageModal(record.checkInImage)}
//                         />
//                       ) : (
//                         <span className="text-gray-500">-</span>
//                       )}
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Image Modal */}
//         {zoomedInImage && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={closeImageModal} // Close modal on overlay click
//           >
//             <div className="relative">
//               <img
//                 src={zoomedInImage}
//                 alt="Zoomed Image"
//                 className="max-w-full max-h-screen object-contain"
//               />
//               <button
//                 className="absolute top-0 right-0 m-4 text-white text-2xl"
//                 onClick={closeImageModal}
//               >
//                 &times;
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Attendance;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar";
import useWindowSize from "../../store/useWindowSize";
import LoadingSpinner from "../LoadingSpinner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../UI/Table";

const Attendance = () => {
  const { isOpen, isMobile, setIsOpen } = useWindowSize();
  const [attendanceData, setAttendanceData] = useState({
    attendance: [],
    summary: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    panel: "",
    includeImages: false,
  });
  const [zoomedInImage, setZoomedInImage] = useState(null);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = token;
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
      const response = await api.get("/admin/attendance", {
        params: queryParams,
      });
      setAttendanceData(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error fetching attendance data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openImageModal = (imageUrl) => setZoomedInImage(imageUrl);
  const closeImageModal = () => setZoomedInImage(null);

  if (error) {
    return (
      <div className="items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchAttendance}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar
        isOpen={isOpen}
        isMobile={isMobile}
        toggleSidebar={() => setIsOpen((prev) => !prev)}
      />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Attendance Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-300 p-4 rounded-lg">
          <div>
            <label className="block text-lg font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">Panel</label>
            <select
              name="panel"
              value={filters.panel}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Panels</option>
              <option value="reception">Reception</option>
              <option value="marketing">Marketing</option>
              <option value="stock">Stock</option>
              <option value="dispatch">Dispatch</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-1">
              Include Images
            </label>
            <select
              name="includeImages"
              value={filters.includeImages}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800">Total Records</h3>
            <p className="text-2xl font-bold text-blue-900">
              {attendanceData.summary.totalRecords || 0}
            </p>
          </div>
          <div className="bg-green-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800">Total Hours</h3>
            <p className="text-2xl font-bold text-green-900">
              {attendanceData.summary.totalHours?.toFixed(2) || 0}
            </p>
          </div>
          <div className="bg-purple-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">
              Avg Hours/Day
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              {attendanceData.summary.averageHoursPerDay?.toFixed(2) || 0}
            </p>
          </div>
          <div className="bg-yellow-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800">
              Active Panels
            </h3>
            <p className="text-2xl font-bold text-yellow-900">
              {Object.keys(attendanceData.summary.byPanel || {}).length}
            </p>
          </div>
        </div>

        <div className="w-full table-fixed text-xs sm:text-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#135a61]">
                <TableHead className="text-amber-600">User</TableHead>
                <TableHead className="text-amber-600">Panel</TableHead>
                <TableHead className="text-amber-600">Date</TableHead>
                <TableHead className="text-amber-600">Check In</TableHead>
                <TableHead className="text-amber-600">Check Out</TableHead>
                <TableHead className="text-amber-600">Hours</TableHead>
                <TableHead className="text-amber-600">Status</TableHead>
                {filters.includeImages && (
                  <TableHead className="text-amber-600">Image</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.attendance.map((record, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="truncate max-w-[120px]">
                    <div className="font-medium text-gray-900 truncate">
                      {record.user?.name}
                    </div>
                    <div className="text-blue-500 truncate">
                      {record.user?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-300 text-blue-800">
                      {record.panel}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(record.selectedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-red-500 font-semibold">
                    {new Date(record.checkInTime).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-red-500 font-semibold">
                    {record.checkOutTime
                      ? new Date(record.checkOutTime).toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-blue-500 font-semibold">
                    {record.totalHours?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        record.status === "checked-out"
                          ? "bg-green-400 text-green-900"
                          : "bg-yellow-300 text-yellow-900"
                      }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  {filters.includeImages && (
                    <TableCell>
                      {record.checkInImage ? (
                        <img
                          src={record.checkInImage}
                          alt="Check-in"
                          className="h-8 w-8 rounded cursor-pointer object-cover"
                          onClick={() => openImageModal(record.checkInImage)}
                        />
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {zoomedInImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeImageModal}
          >
            <div className="relative">
              <img
                src={zoomedInImage}
                alt="Zoomed"
                className="max-w-full max-h-screen object-contain"
              />
              <button
                className="absolute top-0 right-0 m-4 text-white text-2xl"
                onClick={closeImageModal}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
