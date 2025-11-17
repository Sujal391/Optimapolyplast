import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { recordBottleProduction } from '../../../services/api/stock';

export default function BottleProduction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    preformType: '',
    boxesProduced: '',
    bottlesPerBox: '',
    bottleCategory: '',
    remarks: '',
    productionDate: new Date().toISOString().split('T')[0],
  });

  // Calculated values
  const [calculatedValues, setCalculatedValues] = useState({
    totalBottles: 0,
    shrinkRollUsed: 0,
    labelsUsed: 0,
    capsUsed: 0,
    preformsUsed: 0,
  });

  // Update calculated values when form changes
  useEffect(() => {
    const boxes = parseInt(formData.boxesProduced, 10) || 0;
    const bottlesPerBox = parseInt(formData.bottlesPerBox, 10) || 0;
    const totalBottles = boxes * bottlesPerBox;

    // Assuming shrinkRollPerBox = 50 (this should match your backend logic)
    const shrinkRollPerBox = 50;
    const shrinkRollUsed = boxes * shrinkRollPerBox;

    setCalculatedValues({
      totalBottles,
      shrinkRollUsed,
      labelsUsed: totalBottles,
      capsUsed: totalBottles,
      preformsUsed: totalBottles,
    });
  }, [formData.boxesProduced, formData.bottlesPerBox]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.preformType || !formData.boxesProduced || !formData.bottlesPerBox || !formData.bottleCategory) {
      setError('Preform Type, Boxes Produced, Bottles Per Box, and Bottle Category are required');
      return;
    }

    if (parseInt(formData.boxesProduced, 10) <= 0 || parseInt(formData.bottlesPerBox, 10) <= 0) {
      setError('Boxes Produced and Bottles Per Box must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        preformType: formData.preformType,
        boxesProduced: parseInt(formData.boxesProduced, 10),
        bottlesPerBox: parseInt(formData.bottlesPerBox, 10),
        bottleCategory: formData.bottleCategory,
        remarks: formData.remarks,
        productionDate: new Date(formData.productionDate).toISOString(),
      };

      const response = await recordBottleProduction(payload);
      setSuccess('Bottle production recorded successfully!');
      
      // Reset form
      setFormData({
        preformType: '',
        boxesProduced: '',
        bottlesPerBox: '',
        bottleCategory: '',
        remarks: '',
        productionDate: new Date().toISOString().split('T')[0],
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to record bottle production');
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Record Bottle Production</h3>
        
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This will automatically deduct preforms, shrink rolls, labels, and caps from inventory.
          </p>
        </div>

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
              placeholder="e.g., 500ml, 1L, 2L"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bottle Category *
            </label>
            <input
              type="text"
              name="bottleCategory"
              value={formData.bottleCategory}
              onChange={handleInputChange}
              placeholder="e.g., 500ml PET Bottle"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boxes Produced *
            </label>
            <input
              type="number"
              name="boxesProduced"
              value={formData.boxesProduced}
              onChange={handleInputChange}
              placeholder="0"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bottles Per Box *
            </label>
            <input
              type="number"
              name="bottlesPerBox"
              value={formData.bottlesPerBox}
              onChange={handleInputChange}
              placeholder="0"
              min="1"
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

        {/* Calculated Materials Preview */}
        {calculatedValues.totalBottles > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Materials to be Deducted:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">Total Bottles</p>
                <p className="text-xl font-bold text-gray-800">{calculatedValues.totalBottles}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">Preforms Used</p>
                <p className="text-xl font-bold text-gray-800">{calculatedValues.preformsUsed}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">Shrink Roll Used</p>
                <p className="text-xl font-bold text-gray-800">{calculatedValues.shrinkRollUsed}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">Labels Used</p>
                <p className="text-xl font-bold text-gray-800">{calculatedValues.labelsUsed}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-300">
                <p className="text-xs text-gray-600 mb-1">Caps Used</p>
                <p className="text-xl font-bold text-gray-800">{calculatedValues.capsUsed}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Recording...' : 'Record Bottle Production'}
          </Button>
        </div>
      </div>
    </div>
  );
}