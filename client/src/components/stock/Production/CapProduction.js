import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/button';
import ProductionList from './ProductionList';
import {
  fetchRawMaterials,
  recordCapProduction,
  getCapTypes,
  getCapProductions,
  recordWastage
} from '../../../services/api/stock';
import { Trash2 } from 'lucide-react';

// Available cap colors - Your specific list
const CAP_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Black', hex: '#1F2937' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'B.green', hex: '#10B981' },
  { name: 'Dark blue', hex: '#1E3A8A' },
  { name: 'K.blue', hex: '#3B82F6' },
  { name: 'V.purple', hex: '#7C3AED' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'H.pink', hex: '#EC4899' }
];

export default function CapProduction() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Production list state
  const [productionList, setProductionList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [listFilters, setListFilters] = useState({
    capType: '',
    page: 1,
    limit: 10
  });

  // Form state
  const [formData, setFormData] = useState({
    rawMaterials: [],
    capType: '',
    capColor: '', // NEW: Color field
    quantityProduced: '',
    boxesUsed: '',
    bagsUsed: '',
    wastage: '',
    remarks: '',
    productionDate: new Date().toISOString().split('T')[0],
  });

  // Raw material input state
  const [materialInput, setMaterialInput] = useState({
    materialId: '',
    quantityUsed: '',
  });

  // Wastage form state
  const [wastageData, setWastageData] = useState({
    wastageType: '',
    quantityGenerated: '',
    quantityReused: 0,
    reuseReference: '',
    remarks: '',
  });

  // Debounced search for production list
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch materials on mount
  useEffect(() => {
    fetchMaterials();
    loadProductionList();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetchRawMaterials();
      setMaterials(res.materials || res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch materials');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductionList = async (filters = listFilters) => {
    setListLoading(true);
    setListError(null);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.capType && { capType: filters.capType })
      };
      const res = await getCapProductions(params);
      setProductionList(res?.data || []);
      setPagination(res?.pagination || null);
    } catch (err) {
      setListError(err.message || 'Failed to load production list');
      console.error('Error loading production list:', err);
    } finally {
      setListLoading(false);
    }
  };

  // Debounced search handler
  const handleDebouncedSearch = useCallback((searchValue) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const newFilters = { ...listFilters, capType: searchValue, page: 1 };
      setListFilters(newFilters);
      loadProductionList(newFilters);
    }, 500);

    setSearchTimeout(timeout);
  }, [listFilters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NEW: Color selection handler
  const handleColorSelect = (colorName) => {
    setFormData(prev => ({
      ...prev,
      capColor: colorName
    }));
    setError(''); // Clear any errors when color is selected
  };

  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setMaterialInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMaterial = () => {
    if (!materialInput.materialId || !materialInput.quantityUsed) {
      setError('Material and Quantity are required');
      return;
    }

    const selectedMaterial = materials.find(m => m._id === materialInput.materialId);

    setFormData(prev => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        {
          materialId: materialInput.materialId,
          materialName: selectedMaterial?.itemName || 'Unknown',
          quantityUsed: parseFloat(materialInput.quantityUsed),
        }
      ]
    }));

    setMaterialInput({ materialId: '', quantityUsed: '' });
    setError('');
  };

  const handleRemoveMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((_, i) => i !== index)
    }));
  };

  // Wastage input handler
  const handleWastageChange = (e) => {
    const { name, value } = e.target;
    setWastageData(prev => ({
      ...prev,
      [name]: value,
      // Reset quantityReused to 0 if Type 2 is selected
      ...(name === 'wastageType' && value === 'Type 2: Non-reusable / Scrap' ? { quantityReused: 0 } : {})
    }));
  };

  const handleSubmit = async () => {
    if (!formData.capType || !formData.capColor || !formData.quantityProduced || formData.rawMaterials.length === 0) {
      setError('Cap Type, Cap Color, Quantity Produced, and at least one Raw Material are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        rawMaterials: formData.rawMaterials.map(m => ({
          materialId: m.materialId,
          quantityUsed: m.quantityUsed,
        })),
        capType: formData.capType,
        capColor: formData.capColor, // NEW: Include color in payload
        quantityProduced: parseInt(formData.quantityProduced, 10),
        boxesUsed: formData.boxesUsed ? parseInt(formData.boxesUsed, 10) : 0,
        bagsUsed: formData.bagsUsed ? parseInt(formData.bagsUsed, 10) : 0,
        wastage: formData.wastage ? parseInt(formData.wastage, 10) : 0,
        remarks: formData.remarks,
        productionDate: new Date(formData.productionDate).toISOString(),
      };

      // Step 1: Record production
      await recordCapProduction(payload);

      // Step 2: Record wastage if wastage details provided
      if (wastageData.wastageType && wastageData.quantityGenerated) {
        const wastagePayload = {
          wastageType: wastageData.wastageType,
          source: 'Cap',
          quantityGenerated: Number(wastageData.quantityGenerated),
          // Type 2 wastage cannot be reused
          quantityReused: wastageData.wastageType === 'Type 2: Non-reusable / Scrap'
            ? 0
            : Number(wastageData.quantityReused) || 0,
          reuseReference: wastageData.reuseReference || '',
          remarks: wastageData.remarks || '',
          date: new Date(formData.productionDate).toISOString(),
        };
        await recordWastage(wastagePayload);
      }

      setSuccess('Production & Wastage Recorded Successfully!');

      // Reset production form
      setFormData({
        rawMaterials: [],
        capType: '',
        capColor: '', // NEW: Reset color
        quantityProduced: '',
        boxesUsed: '',
        bagsUsed: '',
        wastage: '',
        remarks: '',
        productionDate: new Date().toISOString().split('T')[0],
      });

      // Reset wastage form
      setWastageData({
        wastageType: '',
        quantityGenerated: '',
        quantityReused: 0,
        reuseReference: '',
        remarks: '',
      });

      // Refresh production list
      loadProductionList();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to record cap production');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Record Cap Production</h3>

        {/* Raw Materials Section */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Raw Materials Used</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Material *
              </label>
              <select
                name="materialId"
                value={materialInput.materialId}
                onChange={handleMaterialInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Material --</option>
                {materials.map(material => (
                  <option key={material._id} value={material._id}>
                    {material.itemName} ({material.itemCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Used *
              </label>
              <input
                type="number"
                name="quantityUsed"
                value={materialInput.quantityUsed}
                onChange={handleMaterialInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAddMaterial}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Add Material
              </Button>
            </div>
          </div>

          {/* Added Materials List */}
          {formData.rawMaterials.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h5 className="font-semibold text-gray-700 mb-2">Added Materials:</h5>
              <div className="space-y-2">
                {formData.rawMaterials.map((material, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                    <span className="text-sm text-gray-700">
                      {material.materialName} - {material.quantityUsed} units
                    </span>
                    <button
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Production Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cap Type *
            </label>
            <input
              type="text"
              name="capType"
              value={formData.capType}
              onChange={handleInputChange}
              placeholder="e.g., 28mm, 38mm, 48mm"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* NEW: Cap Color Selector */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cap Color *
            </label>
            <div className="flex flex-wrap gap-3">
              {CAP_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorSelect(color.name)}
                  className={`relative group transition-all ${
                    formData.capColor === color.name
                      ? 'ring-4 ring-blue-500 ring-offset-2'
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  }`}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: color.name === 'White' ? '2px solid #D1D5DB' : '2px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  {/* Checkmark for selected color */}
                  {formData.capColor === color.name && (
                    <svg
                      className="absolute inset-0 m-auto"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={color.name === 'White' || color.name === 'Yellow' ? '#000' : '#FFF'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  
                  {/* Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
            {formData.capColor && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: <span className="font-semibold text-gray-800">{formData.capColor}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Produced *
            </label>
            <input
              type="number"
              name="quantityProduced"
              value={formData.quantityProduced}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boxes Used
            </label>
            <input
              type="number"
              name="boxesUsed"
              value={formData.boxesUsed}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bags Used
            </label>
            <input
              type="number"
              name="bagsUsed"
              value={formData.bagsUsed}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wastage
            </label>
            <input
              type="number"
              name="wastage"
              value={formData.wastage}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Production Date
            </label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
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

        {/* Wastage Details Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Wastage Details (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wastage Type
              </label>
              <select
                name="wastageType"
                value={wastageData.wastageType}
                onChange={handleWastageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Wastage Type --</option>
                <option value="Type 1: Reusable Wastage">Type 1: Total Wastage</option>
                {/* <option value="Type 2: Non-reusable / Scrap">Type 2: -</option> */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Generated
              </label>
              <input
                type="number"
                name="quantityGenerated"
                value={wastageData.quantityGenerated}
                onChange={handleWastageChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* {wastageData.wastageType === 'Type 1: Reusable Wastage' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Reused (Optional)
                  </label>
                  <input
                    type="number"
                    name="quantityReused"
                    value={wastageData.quantityReused}
                    onChange={handleWastageChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reuse Reference (Optional)
                  </label>
                  <input
                    type="text"
                    name="reuseReference"
                    value={wastageData.reuseReference}
                    onChange={handleWastageChange}
                    placeholder="Batch number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )} */}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wastage Remarks
              </label>
              <textarea
                name="remarks"
                value={wastageData.remarks}
                onChange={handleWastageChange}
                placeholder="Optional wastage remarks"
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Recording...' : 'Record Cap Production'}
          </Button>
        </div>
      </div>

      {/* Production List */}
      <div className="mt-8">
        <ProductionList
          title="Cap Production History"
          data={productionList}
          loading={listLoading}
          error={listError}
          pagination={pagination}
          columns={[
            { key: 'capType', label: 'Cap Type' },
            { key: 'quantityProduced', label: 'Quantity Produced' },
            { key: 'wastage', label: 'Wastage' },
            { key: 'usedInBottles', label: 'Used in Bottles' },
            {
              key: 'productionDate',
              label: 'Production Date',
              render: (row) => new Date(row.productionDate).toLocaleDateString()
            },
            {
              key: 'recordedBy',
              label: 'Recorded By',
              render: (row) => row.recordedBy?.name || 'N/A'
            },
            {
              key: 'statistics',
              label: 'Available',
              render: (row) => row.statistics?.available || 0
            }
          ]}
          filterOptions={[
            {
              key: 'capType',
              label: 'Search by Cap Type',
              type: 'text',
              placeholder: 'Search cap type...'
            }
          ]}
          filters={listFilters}
          onFilterChange={(key, value) => {
            // Update the local filter state immediately for UI responsiveness
            setListFilters(prev => ({ ...prev, [key]: value }));
            // Trigger debounced search
            handleDebouncedSearch(value);
          }}
          onPageChange={(page) => {
            const newFilters = { ...listFilters, page };
            setListFilters(newFilters);
            loadProductionList(newFilters);
          }}
        />
      </div>
    </div>
  );
}