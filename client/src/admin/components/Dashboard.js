import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../admin/components/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingSpinner from "./LoadingSpinner";
import useWindowSize from "../store/useWindowSize";

const Dashboard = () => {
  const { isOpen, isMobile, setIsOpen } = useWindowSize();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const mobile = window.innerWidth < 1024;
  //     setIsMobile(mobile);
  //     if (!mobile) setIsSidebarOpen(false);
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

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
          gradient: "from-[#17313E] to-[#6785ab]", // Matching your code
        },
        {
          title: "Total Products",
          value: stats.products.total,
          description: `Bottles: ${stats.products.bottles}, Raw: ${stats.products.rawMaterials}`,
          icon: "📦",
          gradient: "from-[#17313E] to-[#6785ab]", // Matching your code
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
          gradient: "from-[#17313E] to-[#6785ab]", // Matching your code
        },
      ]
    : [];

  const orderStats = stats
    ? [
        {
          status: "Pending",
          count: stats.orders.pending,
          gradient: "from-[#d1bd56] to-[#7a8226]",
        },
        {
          status: "Confirmed",
          count: stats.orders.confirmed,
          color: "bg-blue-400",
        },
        {
          status: "Shipped",
          count: stats.orders.shipped,
          color: "bg-indigo-500",
        },
        {
          status: "Cancelled",
          count: stats.orders.cancelled,
          color: "bg-red-500",
        },
        {
          status: "Preview",
          count: stats.orders.preview,
          color: "bg-gray-500",
        },
        {
          status: "Processing",
          count: stats.orders.processing,
          color: "bg-orange-500",
        },
      ]
    : [];

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans md:(min-width:768px) sm:(min-width:640px) md:p2 md:text-base sm-p1 sm-text-sm ">
      <Sidebar
        isOpen={isOpen}
        isMobile={isMobile}
        toggleSidebar={() => setIsOpen((prev) => !prev)}
      />

      <motion.div
        className="flex-1 transition-all duration-300 flex justify-center items-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 mt-5 w-full max-w-6xl">
          {/* Dashboard Cards */}

          <AnimatePresence>
            {loading ? (
              <motion.div
                className="text-center text-xl text-gray-600 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner />
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
                      <p className="text-sm text-gray-200">
                        {card.description}
                      </p>
                    </div>
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#17313E] to-[#435a79] flex items-center justify-center text-white text-4xl font-bold">
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
              className="mt-8 p-6 rounded-xl shadow-lg bg-gradient-to-br from-[#37647a] to-[#6785ab] text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                Order Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                        className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-white bg-gradient-to-br from-[#17313E] to-[#6785ab] shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <motion.span
                          className="text-4xl animate-spin-slow"
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
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
