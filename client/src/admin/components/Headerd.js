//realll code
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "../../assets/profiles.jpg";
import useWindowSize from "../store/useWindowSize";
import LoadingSpinner from "./LoadingSpinner";

// MUI Components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";

// FontAwesome Icons
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const { isMobile, isOpen, setIsOpen } = useWindowSize();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({ baseURL: process.env.REACT_APP_API });

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

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      const response = await api.get("/admin/profile");
      setProfileData(response.data.profile);
    } catch (err) {
      setError("Error fetching profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      {/* {isMobile && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="fixed left-4 top-20 z-[100] bg-[#0c4e66] p-2 rounded-md text-white"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      )} */}

      {/* Header */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          marginLeft: isMobile ? 0 : "10px",
          marginRight: isMobile ? 0 : "10px",
          left: isMobile ? 0 : 256,
          width: isMobile ? "100%" : "calc(100% - 256px)",
          zIndex: 20,
          transition: "all 0.3s ease",
        }}
      >
        <Toolbar disableGutters sx={{ px: 3 }}>
          <Typography
            variant="h6"
            component={Link}
            to="#"
            sx={{
              textDecoration: "none",
              color: "#1e3a8a",
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            Admin Dashboard
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="subtitle1" fontWeight="600">
                {profileData?.name || "Admin"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData?.role || "Admin"}
              </Typography>
            </Box>

            <IconButton onClick={toggleProfileModal} size="small">
              <Avatar
                alt="Admin"
                src={profile}
                sx={{ border: "2px solid #3b82f6", width: 40, height: 40 }}
              />
            </IconButton>

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              size="small"
              sx={{ whiteSpace: "nowrap" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={toggleProfileModal}>
        <Box
          component={Paper}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            p: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" textAlign="center" gutterBottom>
            Admin Profile
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Avatar
              src={profile}
              alt="Admin"
              sx={{ width: 80, height: 80, border: "2px solid #3b82f6" }}
            />
          </Box>

          <Box sx={{ "& > *": { mb: 1 } }}>
            <Typography>
              <strong>Name:</strong> {profileData?.name || "Admin"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profileData?.email || "N/A"}
            </Typography>
            <Typography>
              <strong>Phone No:</strong> {profileData?.phoneNumber || "N/A"}
            </Typography>
            <Typography>
              <strong>Role:</strong> {profileData?.role || "Admin"}
            </Typography>
            <Typography>
              <strong>Joined:</strong>{" "}
              {profileData?.createdAt
                ? new Date(profileData.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" onClick={toggleProfileModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Error */}
      {error && (
        <Typography color="error" textAlign="center" mt={2}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default Header;
//
//reallll code
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import profile from "../../assets/profiles.jpg";
// import useWindowSize from "../store/useWindowSize";
// import LoadingSpinner from "./LoadingSpinner";

// // MUI Components
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import Paper from "@mui/material/Paper";

// FontAwesome Icons
// import { FaBars, FaTimes } from "react-icons/fa";
// import Sidebar from "./sidebar";

// const Header = () => {
//   const { isMobile, isOpen, setIsOpen } = useWindowSize();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const api = axios.create({ baseURL: process.env.REACT_APP_API });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ")
//           ? token
//           : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   const fetchProfileData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }
//       const response = await api.get("/admin/profile");
//       setProfileData(response.data.profile);
//     } catch (err) {
//       setError("Error fetching profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const toggleProfileModal = () => {
//     setIsProfileModalOpen(!isProfileModalOpen);
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <>
//       {/* Mobile Sidebar Toggle Button */}
//       {isMobile && (
//         <button
//           onClick={() => setIsOpen((prev) => !prev)}
//           className="fixed right-4 top-20 z-[100] bg-[#0c4e66] p-2 rounded-md text-white"
//           aria-label="Toggle sidebar"
//         >
//           {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
//         </button>
//       )}

//       {/* Header */}
//       <AppBar
//         position="fixed"
//         color="default"
//         elevation={1}
//         sx={{
//           marginLeft: isMobile ? 0 : "10px",
//           marginRight: isMobile ? 0 : "10px",
//           left: isMobile ? 0 : 256,
//           width: isMobile ? "100%" : "calc(100% - 256px)",
//           zIndex: 20,
//           transition: "all 0.3s ease",
//         }}
//       >
//         <Toolbar disableGutters sx={{ px: 3 }}>
//           <Typography
//             variant="h6"
//             component={Link}
//             to="#"
//             sx={{
//               textDecoration: "none",
//               color: "#1e3a8a",
//               fontWeight: 600,
//               flexGrow: 1,
//             }}
//           >
//             Admin Dashboard
//           </Typography>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             {!isMobile && (
//               <Box sx={{ textAlign: "right" }}>
//                 <Typography variant="subtitle1" fontWeight="600">
//                   {profileData?.name || "Admin"}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {profileData?.role || "Admin"}
//                 </Typography>
//               </Box>
//             )}

//             <IconButton onClick={toggleProfileModal} size="small">
//               <Avatar
//                 alt="Admin"
//                 src={profile}
//                 sx={{ border: "2px solid #3b82f6", width: 40, height: 40 }}
//               />
//             </IconButton>

//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleLogout}
//               size="small"
//               sx={{ whiteSpace: "nowrap" }}
//             >
//               Logout
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {/* Profile Modal */}
//       <Modal open={isProfileModalOpen} onClose={toggleProfileModal}>
//         <Box
//           component={Paper}
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 300,
//             p: 4,
//             outline: "none",
//           }}
//         >
//           <Typography variant="h6" textAlign="center" gutterBottom>
//             Admin Profile
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
//             <Avatar
//               src={profile}
//               alt="Admin"
//               sx={{ width: 80, height: 80, border: "2px solid #3b82f6" }}
//             />
//           </Box>

//           <Box sx={{ "& > *": { mb: 1 } }}>
//             <Typography>
//               <strong>Name:</strong> {profileData?.name || "Admin"}
//             </Typography>
//             <Typography>
//               <strong>Email:</strong> {profileData?.email || "N/A"}
//             </Typography>
//             <Typography>
//               <strong>Phone No:</strong> {profileData?.phoneNumber || "N/A"}
//             </Typography>
//             <Typography>
//               <strong>Role:</strong> {profileData?.role || "Admin"}
//             </Typography>
//             <Typography>
//               <strong>Joined:</strong>{" "}
//               {profileData?.createdAt
//                 ? new Date(profileData.createdAt).toLocaleDateString()
//                 : "N/A"}
//             </Typography>
//           </Box>

//           <Box sx={{ mt: 3, textAlign: "center" }}>
//             <Button variant="contained" onClick={toggleProfileModal}>
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//       {/* Error */}
//       {error && (
//         <Typography color="error" textAlign="center" mt={2}>
//           {error}
//         </Typography>
//       )}
//     </>
//   );
// };

// export default Header;

//real code
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import profile from "../../assets/profiles.jpg";
// import useWindowSize from "../store/useWindowSize";
// import LoadingSpinner from "./LoadingSpinner";

// // MUI Components
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import Button from "@mui/material/Button";
// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import Paper from "@mui/material/Paper";

// const Header = () => {
//   const { isMobile } = useWindowSize();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const api = axios.create({ baseURL: process.env.REACT_APP_API });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         config.headers.Authorization = token.startsWith("Bearer ")
//           ? token
//           : `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   const fetchProfileData = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }
//       const response = await api.get("/admin/profile");
//       setProfileData(response.data.profile);
//     } catch (err) {
//       setError("Error fetching profile. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const toggleProfileModal = () => {
//     setIsProfileModalOpen(!isProfileModalOpen);
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <AppBar
//       position="fixed"
//       color="default"
//       elevation={1}
//       sx={{
//         marginLeft: isMobile ? 0 : "10px",
//         marginRight: isMobile ? 0 : "10px", // Move right when not mobile
//         left: isMobile ? 0 : 256,
//         width: isMobile ? "100%" : " calc(100% - 256px)",
//         zIndex: (theme) => theme.zIndex.drawer + 1,
//         transition: "all 0.3s ease",
//       }}
//     >
//       <Toolbar disableGutters sx={{ px: 3 }}>
//         <Typography
//           variant="h6"
//           component={Link}
//           to="#"
//           sx={{
//             textDecoration: "none",
//             color: "#1e3a8a",
//             fontWeight: 600,
//             flexGrow: 1,
//           }}
//         >
//           Admin Dashboard
//         </Typography>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           {!isMobile && (
//             <Box sx={{ textAlign: "right" }}>
//               <Typography variant="subtitle1" fontWeight="600">
//                 {profileData?.name || "Admin"}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {profileData?.role || "Admin"}
//               </Typography>
//             </Box>
//           )}

//           <IconButton onClick={toggleProfileModal} size="small">
//             <Avatar
//               alt="Admin"
//               src={profile}
//               sx={{ border: "2px solid #3b82f6", width: 40, height: 40 }}
//             />
//           </IconButton>

//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleLogout}
//             size="small"
//             sx={{ whiteSpace: "nowrap" }}
//           >
//             Logout
//           </Button>
//         </Box>
//       </Toolbar>

//       <Modal open={isProfileModalOpen} onClose={toggleProfileModal}>
//         <Box
//           component={Paper}
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 300,
//             p: 4,
//             outline: "none",
//           }}
//         >
//           <Typography variant="h6" textAlign="center" gutterBottom>
//             Admin Profile
//           </Typography>

//           <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
//             <Avatar
//               src={profile}
//               alt="Admin"
//               sx={{ width: 80, height: 80, border: "2px solid #3b82f6" }}
//             />
//           </Box>

//           <Box sx={{ "& > *": { mb: 1 } }}>
//             <Typography>
//               <strong>Name:</strong> {profileData?.name || "Admin"}
//             </Typography>
//             <Typography>
//               <strong>Email:</strong> {profileData?.email || "N/A"}
//             </Typography>
//             <Typography>
//               <strong>Phone No:</strong> {profileData?.phoneNumber || "N/A"}
//             </Typography>
//             <Typography>
//               <strong>Role:</strong> {profileData?.role || "Admin"}
//             </Typography>
//             <Typography>
//               <strong>Joined:</strong>{" "}
//               {profileData?.createdAt
//                 ? new Date(profileData.createdAt).toLocaleDateString()
//                 : "N/A"}
//             </Typography>
//           </Box>

//           <Box sx={{ mt: 3, textAlign: "center" }}>
//             <Button variant="contained" onClick={toggleProfileModal}>
//               Close
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       {error && (
//         <Typography color="error" textAlign="center" mt={2}>
//           {error}
//         </Typography>
//       )}
//     </AppBar>
//   );
// };

// export default Header;
