import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import profile from '../../assets/profiles.jpg'
import cookies from 'js-cookie';


const Header = ({ isSidebarOpen, searchTerm, setSearchTerm }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate(); // To navigate after logout

  // Create an Axios instance with the base URL
  // const api = axios.create({
  //   baseURL: 'https://rewa-project.onrender.com/api', // Base URL for your API
  // });

  const api = axios.create({
    baseURL: process.env.REACT_APP_API,
  });

  // Request interceptor to add Authorization token if present in localStorage
  api.interceptors.request.use(
    (config) => {
      // const token = localStorage.getItem('token');
      const token = cookies.get("token");
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Fetch profile data from the API
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem('token');
      const token = cookies.get("token");
      if (!token) {
        setError('No authentication token found. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Use the Axios instance to fetch the profile
      const response = await api.get('/admin/profile'); // Endpoint relative to baseURL
      setProfileData(response.data.profile); // Assuming the API response has 'profile' data
    } catch (err) {
      setError('Error fetching profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data when the component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    cookies.remove('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const toggleProfileModal = () => {
    setIsProfileModalOpen(!isProfileModalOpen); // Toggle profile modal visibility
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-60'
      } p-4 bg-gray-100 rounded-lg shadow-md`}
    >
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <Link><h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1></Link>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
         

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="font-semibold">{profileData?.name || 'Admin'}</h2>
              <p className="text-sm text-gray-500">{profileData?.role || 'Admin'}</p>
            </div>
            <img
              src={profile || 'Admin'} // Default image if none provided
              alt="Admin"
              className="rounded-full w-10 h-10 border-2 border-blue-500 cursor-pointer"
              onClick={toggleProfileModal} // Open modal on image click
            />
          </div>

          {/* Logout Button */}
          <Link
            to="/"
            onClick={handleLogout} // Trigger logout logic before navigating
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
          >
            Logout
          </Link>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Admin Profile</h2>
            <div className="flex justify-center mb-4">
              <img
                src={profile || '/path/to/default-image.jpg'}
                alt="Admin"
                className="w-20 h-20 rounded-full border-2 border-blue-500"
              />
            </div>
            <div className="space-y-2">
              {/* <p>
                <strong>ID:</strong> {profileData?._id || 'N/A'}
              </p> */}
              <p>
                <strong>Name:</strong> {profileData?.name || 'Admin'}
              </p>
              <p>
                <strong>Email:</strong> {profileData?.email || 'N/A'}
              </p>
              <p>
                <strong>Phone No:</strong> {profileData?.phoneNumber || 'N/A'}
              </p>
              <p>
                <strong>Role:</strong> {profileData?.role || 'Admin'}
              </p>
              <p>
                <strong>Joined:</strong> {new Date(profileData?.createdAt).toLocaleDateString("en-IN") || 'N/A'}
              </p>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={toggleProfileModal}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Header;
