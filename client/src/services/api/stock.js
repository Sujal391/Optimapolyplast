import apiClient from './client';

// ============ RAW MATERIAL APIs ============

/**
 * Fetch all raw materials
 * GET /raw-materials
 */
export const fetchRawMaterials = async (params = {}) => {
  try {
    const response = await apiClient.get('stock/raw-materials', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add a new raw material
 * POST /raw-material/add
 * @param {Object} data - { itemName, itemCode, subcategory?, unit?, supplier?, minStockLevel?, remarks? }
 */
export const addRawMaterial = async (data) => {
  try {
    const response = await apiClient.post('stock/raw-material/add', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get raw material by ID
 * GET /raw-material/:id
 * @param {string} id - Raw material ID
 */
export const getRawMaterialById = async (id) => {
  try {
    const response = await apiClient.get(`stock/raw-material/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update raw material info
 * PUT /raw-material/:id
 * @param {string} id - Raw material ID
 * @param {Object} data - Updated fields
 */
export const updateRawMaterial = async (id, data) => {
  try {
    const response = await apiClient.put(`stock/raw-material/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Soft delete (inactivate) raw material
 * DELETE /raw-material/:id
 * @param {string} id - Raw material ID
 */
export const deleteRawMaterial = async (id) => {
  try {
    const response = await apiClient.delete(`stock/raw-material/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ INWARD ENTRY APIs ============

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
 * Manual stock adjustment
 * PUT /raw-material/:id/stock
 * @param {string} id - Raw material ID
 * @param {Object} data - { adjustmentType, quantity, reason, remarks? }
 * adjustmentType: 'addition' | 'reduction' | 'set'
 */

export const adjustRawMaterialStock = async (id, data) => {
  try {
    const response = await apiClient.put(`stock/raw-material/${id}/stock`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get current stock report
 * GET /current-stock
 */
export const getCurrentStockReport = async () => {
  try {
    const response = await apiClient.get('stock/current-stock');
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
 * Record a production batch (General production outcome)
 * POST /production/outcome
 * @param {Object} data - { rawMaterialId, usedRawMaterialKg, outcomes: [{outcomeItemId, quantityCreatedKg}], wastageKg, remarks?, productionDate? }
 */
export const recordProductionOutcome = async (data) => {
  try {
    const response = await apiClient.post('stock/production/outcome', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Record preform production
 * POST /production/preform
 * @param {Object} data - { rawMaterials: [], preformType, quantityProduced, wastage?, remarks?, productionDate? }
 */
export const recordPreformProduction = async (data) => {
  try {
    const response = await apiClient.post('stock/production/preform', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Record cap production
 * POST /production/cap
 * @param {Object} data - { rawMaterials: [], capType, quantityProduced, boxesUsed?, bagsUsed?, wastage?, remarks?, productionDate? }
 */
export const recordCapProduction = async (data) => {
  try {
    const response = await apiClient.post('stock/production/cap', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Record bottle production
 * POST /production/bottle
 * @param {Object} data - { preformType, boxesProduced, bottlesPerBox, bottleCategory, remarks?, productionDate? }
 */
export const recordBottleProduction = async (data) => {
  try {
    const response = await apiClient.post('stock/production/bottle', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ OUTCOME ITEMS APIs ============

/**
 * Add outcome item
 * POST /outcome-item/add
 * @param {Object} data - { itemName, itemCode, type, subcategory?, remarks? }
 */
export const addOutcomeItem = async (data) => {
  try {
    const response = await apiClient.post('stock/outcome-item/add', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all outcome items
 * GET /outcome-items
 */
export const fetchOutcomeItems = async () => {
  try {
    const response = await apiClient.get('stock/outcome-items');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ WASTAGE MANAGEMENT APIs ============

/**
 * Record wastage
 * POST /wastage
 * @param {Object} data - { wastageType, source, quantityGenerated, quantityReused?, reuseReference?, remarks?, date? }
 */
export const recordWastage = async (data) => {
  try {
    const response = await apiClient.post('stock/wastage', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update wastage reuse
 * PUT /wastage/reuse
 * @param {Object} data - { wastageId, quantityReused, reuseReference?, remarks? }
 */
export const updateWastageReuse = async (data) => {
  try {
    const response = await apiClient.put('stock/wastage/reuse', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get wastage report
 * GET /wastage-report
 * @param {Object} params - { startDate?, endDate?, source?, wastageType? }
 */
export const getWastageReport = async (params = {}) => {
  try {
    const response = await apiClient.get('stock/wastage-report', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ DIRECT USAGE APIs ============

/**
 * Record direct material usage
 * POST /direct-usage
 * @param {Object} data - { materialId, quantity, purpose, remarks?, usageDate? }
 */
export const recordDirectUsage = async (data) => {
  try {
    const response = await apiClient.post('stock/direct-usage', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ REPORTS & ANALYTICS APIs ============

/**
 * Get stock summary report
 * GET /stock-report
 */
export const getStockReport = async () => {
  try {
    const response = await apiClient.get('stock/stock-report');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get production report
 * GET /production-report
 * @param {Object} params - { startDate?, endDate?, type? }
 */
export const getProductionReport = async (params = {}) => {
  try {
    const response = await apiClient.get('stock/production-report', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get direct usage report
 * GET /usage-report
 * @param {Object} params - { startDate?, endDate? }
 */
export const getUsageReport = async (params = {}) => {
  try {
    const response = await apiClient.get('stock/usage-report', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Fetch raw material summary (admin only)
 * GET /admin/raw-material/summary
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

// ============ ADMIN FUNCTIONS APIs ============

/**
 * Add new category
 * POST /admin/category
 * @param {Object} data - { type, name, code }
 */
export const addCategory = async (data) => {
  try {
    const response = await apiClient.post('admin/category', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get categories
 * GET /admin/categories
 * @param {Object} params - { type? }
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await apiClient.get('admin/categories', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add formula
 * POST /admin/formula
 * @param {Object} data - { name, formula, unit, description? }
 */
export const addFormula = async (data) => {
  try {
    const response = await apiClient.post('admin/formula', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get formulas
 * GET /admin/formulas
 */
export const getFormulas = async () => {
  try {
    const response = await apiClient.get('admin/formulas');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============ EXPORT FUNCTIONS APIs ============

/**
 * Export stock report
 * GET /admin/export/stock-report
 * @param {string} format - 'csv' or 'excel'
 */
export const exportStockReport = async (format = 'csv') => {
  try {
    const response = await apiClient.get('admin/export/stock-report', {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export production report
 * GET /admin/export/production-report
 * @param {Object} params - { startDate?, endDate?, type?, format? }
 */
export const exportProductionReport = async (params = {}) => {
  try {
    const response = await apiClient.get('admin/export/production-report', {
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export wastage report
 * GET /admin/export/wastage-report
 * @param {Object} params - { startDate?, endDate?, source?, wastageType?, format? }
 */
export const exportWastageReport = async (params = {}) => {
  try {
    const response = await apiClient.get('admin/export/wastage-report', {
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
