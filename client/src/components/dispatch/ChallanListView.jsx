import React, { useState } from "react";
import { FaDownload, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const ChallanListView = ({ challans, onReschedule, onDownload, onView, onDelete, loading }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-orange-100", textColor: "text-orange-800", label: "Pending" },
      scheduled: { color: "bg-blue-100", textColor: "text-blue-800", label: "Scheduled" },
      dispatched: { color: "bg-green-100", textColor: "text-green-800", label: "Dispatched" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} ${config.textColor}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!challans || challans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No challans found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-teal-50 text-gray-700">
            <th className="py-3 px-4 text-left font-semibold">Challan No</th>
            <th className="py-3 px-4 text-left font-semibold">Scheduled Date</th>
            <th className="py-3 px-4 text-left font-semibold">Quantity</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Split Info</th>
            <th className="py-3 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {challans.map((challan, index) => (
            <tr
              key={challan._id}
              className={`border-b hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-3 px-4 font-medium">{challan.dcNo || challan._id}</td>
              <td className="py-3 px-4">{formatDate(challan.scheduledDate)}</td>
              <td className="py-3 px-4">
                {challan.splitInfo?.originalQuantity || challan.items?.reduce((acc, item) => acc + item.boxes, 0) || 0}
              </td>
              <td className="py-3 px-4">{getStatusBadge(challan.status)}</td>
              <td className="py-3 px-4 text-sm">
                {challan.splitInfo?.isSplit ? (
                  <span className="text-blue-600">
                    Split {challan.splitInfo.splitIndex + 1}/{challan.splitInfo.totalSplits}
                  </span>
                ) : (
                  <span className="text-gray-500">Single</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onView(challan)}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    title="View Details"
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    onClick={() => onDownload(challan)}
                    className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                    title="Download"
                  >
                    <FaDownload size={16} />
                  </button>
                  {challan.status === "scheduled" && (
                    <button
                      onClick={() => onReschedule(challan)}
                      className="p-2 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition-colors"
                      title="Reschedule"
                    >
                      <FaEdit size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(challan)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChallanListView;

