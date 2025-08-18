import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import cookies from 'js-cookie';


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
      // const token = localStorage.getItem("token");
      const token = cookies.get("token");
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
        },
        {
          title: "Total Products",
          value: stats.products.total,
          description: `Bottles: ${stats.products.bottles}, Raw: ${stats.products.rawMaterials}`,
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
        },
      ]
    : [];

  const orderStats = stats
    ? [
        { status: "Pending", count: stats.orders.pending, border: "border-yellow-500", text: "text-yellow-700" },
        { status: "Confirmed", count: stats.orders.confirmed, border: "border-blue-500", text: "text-blue-700" },
        { status: "Shipped", count: stats.orders.shipped, border: "border-indigo-500", text: "text-indigo-700" },
        { status: "Cancelled", count: stats.orders.cancelled, border: "border-red-500", text: "text-red-700" },
        { status: "Preview", count: stats.orders.preview, border: "border-gray-500", text: "text-gray-700" },
        { status: "Processing", count: stats.orders.processing, border: "border-orange-500", text: "text-orange-700" },
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
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Breakdown */}
        {stats && (
          <motion.div
            className="mt-8 p-6 rounded-xl border border-gray-200 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orderStats.map((order, index) => (
                <motion.div
                  key={index}
                  className={`p-5 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition border-l-4 ${order.border}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className={`text-sm font-medium tracking-wide uppercase text-gray-600`}>{order.status}</h3>
                    <span className="text-2xl font-semibold text-gray-900">
                      {order.count.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{`Orders in ${order.status.toLowerCase()} status`}</p>
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