import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import ProductionList from './ProductionList';
import {
  fetchRawMaterials,
  recordPreformProduction,
  // getPreformTypes,
  getPreformProductions,
  recordWastage
} from '../../../services/api/stock';
import { Trash2 } from 'lucide-react';

export default function PreformProduction() {
  const [materials, setMaterials] = useState([]);
  // const [preformTypes, setPreformTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Production list state
  const [productionList, setProductionList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [listFilters, setListFilters] = useState({
    preformType: '',
    page: 1,
    limit: 10
  });

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    rawMaterials: [],
    preformType: '',
    quantityProduced: '',
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

  // Fetch materials and preform types on mount
  useEffect(() => {
    fetchMaterials();
    // loadPreformTypes();
    loadProductionList();
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
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

  // const loadPreformTypes = async () => {
  //   try {
  //     const res = await getPreformTypes();
  //     setPreformTypes(res?.data || []);
  //   } catch (err) {
  //     console.error('Error loading preform types:', err);
  //   }
  // };

  const loadProductionList = async (filters = listFilters) => {
    setListLoading(true);
    setListError(null);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.preformType && { preformType: filters.preformType })
      };
      const res = await getPreformProductions(params);
      setProductionList(res?.data || []);
      setPagination(res?.pagination || null);
    } catch (err) {
      setListError(err.message || 'Failed to load production list');
      console.error('Error loading production list:', err);
    } finally {
      setListLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // Debounced filter change handler
  const handleFilterChange = (key, value) => {
    const newFilters = { ...listFilters, [key]: value, page: 1 };
    setListFilters(newFilters);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      loadProductionList(newFilters);
    }, 500);
  };

  const handleSubmit = async () => {
    if (!formData.preformType || !formData.quantityProduced || formData.rawMaterials.length === 0) {
      setError('Preform Type, Quantity Produced, and at least one Raw Material are required');
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
        preformType: formData.preformType,
        quantityProduced: parseInt(formData.quantityProduced, 10),
        wastage: formData.wastage ? parseInt(formData.wastage, 10) : 0,
        remarks: formData.remarks,
        productionDate: new Date(formData.productionDate).toISOString(),
      };

      // Step 1: Record production
      await recordPreformProduction(payload);

      // Step 2: Record wastage if wastage details provided
      if (wastageData.wastageType && wastageData.quantityGenerated) {
        const wastagePayload = {
          wastageType: wastageData.wastageType,
          source: 'Preform',
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
        preformType: '',
        quantityProduced: '',
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
      setError(err.message || 'Failed to record preform production');
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Record Preform Production</h3>

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
              Preform Type *
            </label>
            <input
              type="text"
              name="preformType"
              value={formData.preformType}
              onChange={handleInputChange}
              placeholder="Enter Preform Type (e.g., 28mm 500ml)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            {loading ? 'Recording...' : 'Record Preform Production'}
          </Button>
        </div>
      </div>

      {/* Production List */}
      <div className="mt-8">
        <ProductionList
          title="Preform Production History"
          data={productionList}
          loading={listLoading}
          error={listError}
          pagination={pagination}
          columns={[
            { key: 'outcomeType', label: 'Preform Type' },
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
              key: 'preformType',
              label: 'Filter by Preform Type',
              type: 'text',
            }
          ]}
          filters={listFilters}
          onFilterChange={handleFilterChange}
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