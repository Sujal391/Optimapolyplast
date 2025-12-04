import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Production List Component
 * Displays paginated production records with filtering and sorting
 */
export default function ProductionList({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination = null,
  onPageChange = () => {},
  onFilterChange = () => {},
  filters = {},
  filterOptions = []
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

      {/* Filters */}
      {filterOptions.length > 0 && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {filterOptions.map((option) => (
            <div key={option.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {option.label}
              </label>
              {option.type === 'select' ? (
                <select
                  value={filters[option.key] || ''}
                  onChange={(e) => onFilterChange(option.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  {option.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={option.type}
                  value={filters[option.key] || ''}
                  onChange={(e) => onFilterChange(option.key, e.target.value)}
                  placeholder={option.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No production records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={row._id || idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

