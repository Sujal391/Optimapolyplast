import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import Paginator from '../common/Paginator';
import { fetchRawMaterials, addRawMaterial } from '../../services/api/stock';
import cookies from 'js-cookie';

export default function RawMaterial() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    remarks: '',
  });

  // Fetch raw materials on mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchRawMaterials();
      setMaterials(response.materials || response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch raw materials');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMaterial = async () => {
    if (!formData.itemName || !formData.itemCode) {
      setError('Item Name and Item Code are required');
      return;
    }

    try {
      setLoading(true);
      await addRawMaterial(formData);
      setSuccess('Raw material added successfully!');
      setFormData({ itemName: '', itemCode: '', remarks: '' });
      setIsModalOpen(false);
      await fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add raw material');
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedMaterials = materials.slice(startIdx, endIdx);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Raw Material Management</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Add Raw Material
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Table */}
        {!loading && materials.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Item Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Item Code</th>
                    <th className="px-6 py-3 text-left font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMaterials.map((material, index) => (
                    <tr
                      key={material._id}
                      className={`border-b hover:bg-gray-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">{material.itemName}</td>
                      <td className="px-6 py-4 text-gray-700">{material.itemCode}</td>
                      <td className="px-6 py-4 text-gray-700">{material.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between px-6 pb-6">
              <div className="text-sm text-gray-600">
                Showing {Math.min(materials.length, startIdx + 1)}–{Math.min(materials.length, endIdx)} of {materials.length}
              </div>
              <Paginator page={page} total={materials.length} pageSize={pageSize} onPageChange={setPage} />
              <select
                className="border rounded px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) => { setPage(1); setPageSize(parseInt(e.target.value, 10)); }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {!loading && materials.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No raw materials found. Add one to get started!</p>
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Raw Material</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new raw material.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="e.g., Plastic Resin"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code *
              </label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                placeholder="e.g., RM001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Optional remarks"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMaterial}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Adding...' : 'Add Material'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
