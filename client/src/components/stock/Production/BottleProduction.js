import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import ProductionList from './ProductionList';

// 👉 API imports
import {
  recordBottleProduction,
  getAvailablePreformTypes,
  getCapTypes,
  checkMaterialAvailability,
  getPreformProductions,
  recordWastage
} from '../../../services/api/stock';

export default function BottleProduction() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [preformTypes, setPreformTypes] = useState([]);
  const [capTypes, setCapTypes] = useState([]);

  const [availability, setAvailability] = useState(null);

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

  const [formData, setFormData] = useState({
    preformType: '',
    boxesProduced: '',
    bottlesPerBox: '',
    bottleCategory: '',
    remarks: '',
    productionDate: new Date().toISOString().split('T')[0],
  });

  // Wastage form state
  const [wastageData, setWastageData] = useState({
    wastageType: '',
    quantityGenerated: '',
    quantityReused: 0,
    reuseReference: '',
    remarks: '',
  });

  // 🔹 Load Preform Types + Cap Types on Mount
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const pf = await getAvailablePreformTypes();
        setPreformTypes(pf?.data || []);

        const caps = await getCapTypes();
        setCapTypes(caps?.data || []);

      } catch (err) {
        console.error('Dropdown load failed', err);
      }
    }
    loadDropdowns();
    loadProductionList();
  }, []);

  // 🔹 Load bottle production list
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

  // 🔹 Auto Check Availability when form fields change
  useEffect(() => {
    autoCheckAvailability();
  }, [formData.preformType, formData.boxesProduced, formData.bottlesPerBox, formData.bottleCategory]);

  // 🔹 INTEGRATION: Check /production/check-availability
  const autoCheckAvailability = async () => {
    // Reset availability if any required field is missing
    if (
      !formData.preformType ||
      !formData.boxesProduced ||
      !formData.bottlesPerBox ||
      !formData.bottleCategory
    ) {
      setAvailability(null);
      return;
    }

    try {
      setChecking(true);
      setError('');

      const params = {
  preformType: formData.preformType,
  boxes: Number(formData.boxesProduced),
  bottlesPerBox: Number(formData.bottlesPerBox),
  bottleCategory: formData.bottleCategory
};

const res = await checkMaterialAvailability(params);

if (res?.success) {
  setAvailability(res.data || null);
} else {
  setAvailability(null);
}

    } catch (err) {
      console.error('Availability check failed:', err);
      setAvailability(null);
    } finally {
      setChecking(false);
    }
  };

  // 🔹 Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Wastage input handler
  const handleWastageChange = (e) => {
    const { name, value } = e.target;
    setWastageData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'wastageType' && value === 'Type 2: Non-reusable / Scrap' ? { quantityReused: 0 } : {})
    }));
  };

  // 🔹 Submit Handler (POST /production/bottle)
  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.preformType || !formData.boxesProduced || !formData.bottlesPerBox || !formData.bottleCategory) {
      setError("Preform type, boxes produced, bottles per box, and bottle category are required");
      return;
    }

    if (availability && availability.canProduce === false) {
      setError("Insufficient material stock. Cannot produce. Please check the availability details below.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        preformType: formData.preformType,
        boxesProduced: Number(formData.boxesProduced),
        bottlesPerBox: Number(formData.bottlesPerBox),
        bottleCategory: formData.bottleCategory,
        remarks: formData.remarks,
        productionDate: new Date(formData.productionDate).toISOString(),
      };

      // Step 1: Record production
      await recordBottleProduction(payload);

      // Step 2: Record wastage if wastage details provided
      if (wastageData.wastageType && wastageData.quantityGenerated) {
        const wastagePayload = {
          wastageType: wastageData.wastageType,
          source: 'Bottle',
          quantityGenerated: Number(wastageData.quantityGenerated),
          quantityReused: wastageData.wastageType === 'Type 2: Non-reusable / Scrap'
            ? 0
            : Number(wastageData.quantityReused) || 0,
          reuseReference: wastageData.reuseReference || '',
          remarks: wastageData.remarks || '',
          date: new Date(formData.productionDate).toISOString(),
        };
        await recordWastage(wastagePayload);
      }

      setSuccess("Production & Wastage Recorded Successfully!");

      // Reset forms
      setFormData({
        preformType: '',
        boxesProduced: '',
        bottlesPerBox: '',
        bottleCategory: '',
        remarks: '',
        productionDate: new Date().toISOString().split('T')[0],
      });

      setWastageData({
        wastageType: '',
        quantityGenerated: '',
        quantityReused: 0,
        reuseReference: '',
        remarks: '',
      });

      setAvailability(null);
      loadProductionList();

    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to record bottle production";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Record Bottle Production</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Preform Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preform Type *
            </label>
            <select
              name="preformType"
              value={formData.preformType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Preform</option>
              {preformTypes.map((p, idx) => (
                <option key={idx} value={p.type}>{p.type}</option>
              ))}
            </select>
          </div>

          {/* Bottle Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bottle Category *
            </label>
            <input
              type="text"
              name="bottleCategory"
              value={formData.bottleCategory}
              onChange={handleInputChange}
              placeholder="500ml, 1L, etc."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boxes Produced *
            </label>
            <input
              type="number"
              name="boxesProduced"
              value={formData.boxesProduced}
              onChange={handleInputChange}
              placeholder="100"
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bottles Per Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bottles Per Box *
            </label>
            <input
              type="number"
              name="bottlesPerBox"
              value={formData.bottlesPerBox}
              onChange={handleInputChange}
              placeholder="12"
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Production Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Production Date
            </label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Optional production notes"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* AVAILABILITY STATUS - Enhanced Display */}
        {checking && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-700 font-medium">Checking material availability...</p>
            </div>
          </div>
        )}

        {availability && (
          <div className="mb-6">
            {/* Overall Status Banner */}
            <div className={`p-4 mb-4 rounded-lg border-2 ${
              availability.canProduce 
                ? 'bg-green-50 border-green-400' 
                : 'bg-red-50 border-red-400'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {availability.canProduce ? (
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <p className={`font-bold text-lg ${
                      availability.canProduce ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {availability.canProduce 
                        ? 'Production Ready ✓' 
                        : 'Insufficient Materials ✗'}
                    </p>
                    <p className={`text-sm ${
                      availability.canProduce ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {availability.canProduce 
                        ? 'All required materials are available' 
                        : 'Some materials are insufficient for production'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Summary */}
            {availability.requirements && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Production Requirements</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <RequirementBox label="Total Bottles" value={availability.requirements.bottles} />
                  <RequirementBox label="Preforms Needed" value={availability.requirements.preforms} />
                  <RequirementBox label="Caps Needed" value={availability.requirements.caps} />
                  <RequirementBox label="Shrink Roll" value={`${availability.requirements.shrinkRoll} gm`} />
                  <RequirementBox label="Labels Needed" value={availability.requirements.labels} />
                </div>
              </div>
            )}

            {/* Material Availability Details */}
            {availability.availability && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-3">Material Availability Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Preforms */}
                  {availability.availability.preforms && (
                    <MaterialCard
                      title="Preforms"
                      icon="🔹"
                      data={availability.availability.preforms}
                      required={availability.requirements?.preforms}
                    />
                  )}

                  {/* Caps */}
                  {availability.availability.caps && (
                    <MaterialCard
                      title={`Caps (${availability.availability.caps.type || 'N/A'})`}
                      icon="🔘"
                      data={availability.availability.caps}
                      required={availability.requirements?.caps}
                    />
                  )}

                  {/* Shrink Roll */}
                  {availability.availability.shrinkRoll && (
                    <MaterialCard
                      title="Shrink Roll"
                      icon="📦"
                      data={{
                        available: availability.availability.shrinkRoll.available,
                        sufficient: availability.availability.shrinkRoll.sufficient,
                        shortage: availability.availability.shrinkRoll.sufficient 
                          ? 0 
                          : availability.availability.shrinkRoll.required - availability.availability.shrinkRoll.available
                      }}
                      required={availability.availability.shrinkRoll.required}
                      unit={availability.availability.shrinkRoll.unit}
                    />
                  )}

                  {/* Labels */}
                  {availability.availability.labels && (
                    <MaterialCard
                      title="Labels"
                      icon="🏷️"
                      data={{
                        available: availability.availability.labels.available,
                        sufficient: availability.availability.labels.sufficient,
                        shortage: availability.availability.labels.sufficient 
                          ? 0 
                          : availability.availability.labels.required - availability.availability.labels.available
                      }}
                      required={availability.availability.labels.required}
                      unit={availability.availability.labels.unit}
                    />
                  )}

                </div>
              </div>
            )}
          </div>
        )}

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
                <option value="Type 1: Reusable Wastage">Type 1: Reusable Wastage</option>
                <option value="Type 2: Non-reusable / Scrap">Type 2: Non-reusable / Scrap</option>
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

            {wastageData.wastageType === 'Type 1: Reusable Wastage' && (
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
            )}

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

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || checking || (availability && !availability.canProduce)}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Recording...' : 'Record Bottle Production'}
          </Button>
        </div>
      </div>

      {/* Production List */}
      <div className="mt-8">
        <ProductionList
          title="Bottle Production History"
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
              type: 'select',
              options: preformTypes.map(type => ({ value: type.type, label: type.type }))
            }
          ]}
          filters={listFilters}
          onFilterChange={(key, value) => {
            const newFilters = { ...listFilters, [key]: value, page: 1 };
            setListFilters(newFilters);
            loadProductionList(newFilters);
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

// Helper component for requirements display
function RequirementBox({ label, value }) {
  return (
    <div className="bg-white p-3 rounded border border-gray-200 text-center">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Enhanced Material Card Component
function MaterialCard({ title, icon, data, required, unit = 'nos' }) {
  const isAvailable = data.sufficient;
  const shortage = data.shortage || 0;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isAvailable ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          <h5 className="font-semibold text-gray-800">{title}</h5>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isAvailable ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
        }`}>
          {isAvailable ? '✓ Sufficient' : '✗ Insufficient'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Available:</span>
          <span className="font-semibold text-gray-800">
            {data.available} {unit}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Required:</span>
          <span className="font-semibold text-gray-800">
            {required} {unit}
          </span>
        </div>

        {!isAvailable && shortage > 0 && (
          <div className="flex justify-between items-center pt-2 border-t border-red-200">
            <span className="text-sm font-medium text-red-700">Shortage:</span>
            <span className="font-bold text-red-700">
              {shortage} {unit}
            </span>
          </div>
        )}

        {isAvailable && (
          <div className="flex justify-between items-center pt-2 border-t border-green-200">
            <span className="text-sm font-medium text-green-700">Extra:</span>
            <span className="font-bold text-green-700">
              {data.available - required} {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}