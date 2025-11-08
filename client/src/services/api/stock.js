import apiClient from './client';

// ============ RAW MATERIAL APIs ============

/**
 * Fetch all raw materials
 * GET /raw-materials
 */
export const fetchRawMaterials = async () => {
  try {
    const response = await apiClient.get('stock/raw-materials');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add a new raw material
 * POST /raw-material/add
 * @param {Object} data - { itemName, itemCode, remarks }
 */
export const addRawMaterial = async (data) => {
  try {
    const response = await apiClient.post('stock/raw-material/add', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ INWARD ENTRY APIs ============

/**
 * Fetch all inward entries
 * GET /raw-material/entries
 */
export const fetchInwardEntries = async () => {
  try {
    const response = await apiClient.get('stock/raw-material/entries');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Record an inward entry
 * POST /raw-material/entry
 * @param {Object} data - { rawMaterialId, quantityKg, remarks }
 */
export const recordInwardEntry = async (data) => {
  try {
    const response = await apiClient.post('stock/raw-material/entry', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ PRODUCTION APIs ============

/**
 * Fetch all production outcomes
 * GET /production/outcomes
 */
export const fetchProductionOutcomes = async () => {
  try {
    const response = await apiClient.get('stock/production/outcomes');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Record a production batch
 * POST /production/outcome
 * @param {Object} data - { rawMaterialId, usedQuantityKg, outcomes: [{outcomeItemId, quantityCreatedKg}], wastageKg, remarks }
 */
export const recordProductionOutcome = async (data) => {
  try {
    const response = await apiClient.post('stock/production/outcome', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ RAW MATERIAL SUMMARY APIs ============

/**
 * Fetch raw material summary (admin only)
 * GET /raw-material/summary
 * Returns: { success, data: { summary: [...], overall: { totalWastageKg, totalProducedKg } } }
 */
export const getRawMaterialSummary = async () => {
  try {
    const response = await apiClient.get('admin/raw-material/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
