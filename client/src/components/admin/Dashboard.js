import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");
        setStats(response.data.stats);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Session expired. Please login again."
            : "Error fetching stats. Please try again later."
        );
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          title: "Total Users",
          value: stats.users.total,
          description: `Active: ${stats.users.active}, Inactive: ${stats.users.inactive}`,
          icon: "👥",
          gradient: "from-blue-700 to-purple-700", // Matching your code
        },
        {
          title: "Total Products",
          value: stats.products.total,
          description: `Bottles: ${stats.products.bottles}, Raw: ${stats.products.rawMaterials}`,
          icon: "📦",
          gradient: "from-blue-700 to-purple-700", // Matching your code
        },
        {
          title: "Total Orders",
          value:
            stats.orders.pending +
            stats.orders.confirmed +
            stats.orders.shipped +
            stats.orders.cancelled +
            stats.orders.preview +
            stats.orders.processing,
          description: `Shipped: ${stats.orders.shipped}, Pending: ${stats.orders.pending}`,
          icon: "📋",
          gradient: "from-blue-700 to-purple-700", // Matching your code
        },
      ]
    : [];

  const orderStats = stats
    ? [
        { status: "Pending", count: stats.orders.pending, color: "bg-yellow-500" },
        { status: "Confirmed", count: stats.orders.confirmed, color: "bg-blue-500" },
        { status: "Shipped", count: stats.orders.shipped, color: "bg-indigo-500" },
        { status: "Cancelled", count: stats.orders.cancelled, color: "bg-red-500" },
        { status: "Preview", count: stats.orders.preview, color: "bg-gray-500" },
        { status: "Processing", count: stats.orders.processing, color: "bg-orange-500" },
      ]
    : [];

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      <motion.div
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dashboard Cards */}
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="text-center text-xl text-gray-600 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading...
            </motion.div>
          ) : error ? (
            <motion.div
              className="text-center text-red-500 font-semibold mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ staggerChildren: 0.2 }}
            >
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-lg shadow-lg bg-gradient-to-br ${card.gradient} text-white transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-center">
                    <span className="text-6xl">{card.icon}</span>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center justify-center mb-4">
                    <h3 className="text-2xl font-semibold">{card.title}</h3>
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <p className="text-sm text-gray-200">{card.description}</p>
                  </div>
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-900 flex items-center justify-center text-white text-4xl font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        key={card.value}
                      >
                        {card.value.toLocaleString()}
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Breakdown */}
        {stats && (
          <motion.div
            className="mt-8 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-600 to-purple-700 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Order Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderStats.map((order, index) => (
                <motion.div
                  key={index}
                  className={`flex flex-col items-start p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl ${order.color} text-white border-l-4`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-3xl font-semibold">{order.status}</h3>
                    <motion.div
                      className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-white bg-gradient-to-br from-blue-400 to-purple-900 shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <motion.span
                        className="text-4xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        key={order.count}
                      >
                        {order.count.toLocaleString()}
                      </motion.span>
                    </motion.div>
                  </div>
                  <p className="text-lg mt-3">{`Orders in ${order.status.toLowerCase()} status`}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;