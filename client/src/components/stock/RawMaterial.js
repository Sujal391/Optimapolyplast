import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  TablePagination,
  Tooltip,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  PostAdd as PostAddIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import {
  fetchRawMaterials,
  addRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
  recordInwardEntry,
  fetchInwardEntries,
  adjustRawMaterialStock,
} from '../../services/api/stock';

export default function RawMaterial() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Details view modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [materialDetails, setMaterialDetails] = useState(null);
  const [detailsTab, setDetailsTab] = useState(0);
  
  // Inward Entry Modal
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedMaterialForEntry, setSelectedMaterialForEntry] = useState(null);
  const [entryFormData, setEntryFormData] = useState({
    quantityKg: '',
    remarks: '',
  });

  // All Entries Modal
  const [isAllEntriesModalOpen, setIsAllEntriesModalOpen] = useState(false);
  const [allEntries, setAllEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesPage, setEntriesPage] = useState(0);
  const [entriesRowsPerPage, setEntriesRowsPerPage] = useState(10);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Form state for Add/Edit Material
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    subcategory: '',
    unit: 'Kg',
    supplier: '',
    minStockLevel: 0,
    remarks: '',
  });

  // Stock Adjustment Form State
  const [stockAdjustmentData, setStockAdjustmentData] = useState({
    adjustmentType: 'addition',
    quantity: '',
    reason: '',
    stockRemarks: '',
  });
  const [hasStockAdjustment, setHasStockAdjustment] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch raw materials when filters change
  useEffect(() => {
    fetchMaterials();
  }, [debouncedSearch, categoryFilter, showInactive]);

  const fetchMaterials = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter) params.category = categoryFilter;
      if (showInactive) params.showInactive = true;

      const response = await fetchRawMaterials(params);
      
      if (response.success) {
        const materialsData = response.data || [];
        const sortedMaterials = materialsData.sort((a, b) => 
          a.itemCode.localeCompare(b.itemCode, undefined, { numeric: true, sensitivity: 'base' })
        );
        setMaterials(sortedMaterials);
      } else {
        setError('Failed to fetch raw materials');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch raw materials');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterialDetails = async (id) => {
    setDetailsLoading(true);
    setError('');
    try {
      const response = await getRawMaterialById(id);
      
      if (response.success) {
        setMaterialDetails(response.data);
      } else {
        setError('Failed to fetch material details');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch material details');
      console.error('Error fetching material details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const fetchAllEntries = async () => {
    setEntriesLoading(true);
    setError('');
    try {
      const response = await fetchInwardEntries();
      if (response.success) {
        setAllEntries(response.data || []);
      } else {
        setError('Failed to fetch entries');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch entries');
      console.error('Error fetching entries:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleViewDetails = async (material) => {
    setIsDetailsOpen(true);
    setDetailsTab(0);
    await fetchMaterialDetails(material._id);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setMaterialDetails(null);
    setDetailsTab(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert itemCode to uppercase with underscores
    if (name === 'itemCode') {
      processedValue = value
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, '_') // Replace any character that's not A-Z, 0-9, or _ with underscore
        .replace(/_+/g, '_'); // Replace multiple consecutive underscores with single underscore
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minStockLevel' ? Number(processedValue) : processedValue
    }));
  };

  const handleStockAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setStockAdjustmentData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? value : value
    }));
    setHasStockAdjustment(true);
  };

  const handleOpenModal = (material = null) => {
    if (material) {
      setIsEditMode(true);
      setCurrentMaterialId(material._id);
      setFormData({
        itemName: material.itemName,
        itemCode: material.itemCode,
        subcategory: material.subcategory || '',
        unit: material.unit || 'Kg',
        supplier: material.supplier || '',
        minStockLevel: material.minStockLevel || 0,
        remarks: material.remarks || '',
      });
      // Reset stock adjustment data
      setStockAdjustmentData({
        adjustmentType: 'addition',
        quantity: '',
        reason: '',
        stockRemarks: '',
      });
      setHasStockAdjustment(false);
    } else {
      setIsEditMode(false);
      setCurrentMaterialId(null);
      setFormData({
        itemName: '',
        itemCode: '',
        subcategory: '',
        unit: 'Kg',
        supplier: '',
        minStockLevel: 0,
        remarks: '',
      });
      setStockAdjustmentData({
        adjustmentType: 'addition',
        quantity: '',
        reason: '',
        stockRemarks: '',
      });
      setHasStockAdjustment(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentMaterialId(null);
    setFormData({
      itemName: '',
      itemCode: '',
      subcategory: '',
      unit: 'Kg',
      supplier: '',
      minStockLevel: 0,
      remarks: '',
    });
    setStockAdjustmentData({
      adjustmentType: 'addition',
      quantity: '',
      reason: '',
      stockRemarks: '',
    });
    setHasStockAdjustment(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.itemCode) {
      setError('Item Name and Item Code are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      let materialUpdateSuccess = false;
      let stockAdjustmentSuccess = false;

      // Check if material details have changed
      const materialDataChanged = isEditMode && (
        materials.find(m => m._id === currentMaterialId)?.itemName !== formData.itemName ||
        materials.find(m => m._id === currentMaterialId)?.subcategory !== formData.subcategory ||
        materials.find(m => m._id === currentMaterialId)?.unit !== formData.unit ||
        materials.find(m => m._id === currentMaterialId)?.supplier !== formData.supplier ||
        materials.find(m => m._id === currentMaterialId)?.minStockLevel !== formData.minStockLevel ||
        materials.find(m => m._id === currentMaterialId)?.remarks !== formData.remarks
      );

      // Update material details if changed or adding new
      if (!isEditMode || materialDataChanged) {
        if (isEditMode) {
          const response = await updateRawMaterial(currentMaterialId, formData);
          if (response.success) {
            materialUpdateSuccess = true;
          }
        } else {
          const response = await addRawMaterial(formData);
          if (response.success) {
            materialUpdateSuccess = true;
          }
        }
      }

      // Adjust stock if there's stock adjustment data
      if (isEditMode && hasStockAdjustment && stockAdjustmentData.quantity && parseFloat(stockAdjustmentData.quantity) > 0) {
        const adjustmentPayload = {
          adjustmentType: stockAdjustmentData.adjustmentType,
          quantity: parseFloat(stockAdjustmentData.quantity),
          reason: stockAdjustmentData.reason || 'Manual adjustment',
          remarks: stockAdjustmentData.stockRemarks || '',
        };

        const stockResponse = await adjustRawMaterialStock(currentMaterialId, adjustmentPayload);
        if (stockResponse.success) {
          stockAdjustmentSuccess = true;
        }
      }

      // Set success message
      if (isEditMode) {
        if (materialUpdateSuccess && stockAdjustmentSuccess) {
          setSuccess('Raw material and stock updated successfully!');
        } else if (materialUpdateSuccess) {
          setSuccess('Raw material updated successfully!');
        } else if (stockAdjustmentSuccess) {
          setSuccess('Stock adjusted successfully!');
        }
      } else {
        setSuccess('Raw material added successfully!');
      }
      
      handleCloseModal();
      await fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Item code already exists');
      } else {
        setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} raw material`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this raw material? This will deactivate the item.')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await deleteRawMaterial(id);
      
      if (response.success) {
        setSuccess(response.message || 'Raw material deleted successfully!');
        await fetchMaterials();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete raw material');
    } finally {
      setLoading(false);
    }
  };

  // Inward Entry Modal Handlers
  const handleOpenEntryModal = (material) => {
    setSelectedMaterialForEntry(material);
    setEntryFormData({
      quantityKg: '',
      remarks: '',
    });
    setIsEntryModalOpen(true);
  };

  const handleCloseEntryModal = () => {
    setIsEntryModalOpen(false);
    setSelectedMaterialForEntry(null);
    setEntryFormData({
      quantityKg: '',
      remarks: '',
    });
    setError('');
  };

  const handleEntryInputChange = (e) => {
    const { name, value } = e.target;
    setEntryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEntry = async () => {
    if (!entryFormData.quantityKg) {
      setError('Quantity is required');
      return;
    }

    const quantity = parseFloat(entryFormData.quantityKg);
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await recordInwardEntry({
        rawMaterialId: selectedMaterialForEntry._id,
        quantityKg: quantity,
        remarks: entryFormData.remarks || undefined,
      });
      
      setSuccess(response.message || 'Raw material entry added successfully');
      handleCloseEntryModal();
      await fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record entry');
    } finally {
      setLoading(false);
    }
  };

  // All Entries Modal Handlers
  const handleOpenAllEntriesModal = async () => {
    setIsAllEntriesModalOpen(true);
    await fetchAllEntries();
  };

  const handleCloseAllEntriesModal = () => {
    setIsAllEntriesModalOpen(false);
    setAllEntries([]);
    setEntriesPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEntriesChangePage = (event, newPage) => {
    setEntriesPage(newPage);
  };

  const handleEntriesChangeRowsPerPage = (event) => {
    setEntriesRowsPerPage(parseInt(event.target.value, 10));
    setEntriesPage(0);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return 'error';
      case 'LOW_STOCK':
        return 'warning';
      case 'NORMAL':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStockStatusLabel = (status) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      case 'LOW_STOCK':
        return 'Low Stock';
      case 'NORMAL':
        return 'Normal';
      default:
        return status || 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const uniqueCategories = [...new Set(materials.map(m => m.subcategory).filter(Boolean))];

  const paginatedMaterials = materials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const paginatedEntries = allEntries.slice(
    entriesPage * entriesRowsPerPage,
    entriesPage * entriesRowsPerPage + entriesRowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Raw Material Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          size="large"
        >
          Add Raw Material
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={categoryFilter}
                label="Subcategory"
                sx={{ minWidth: 150 }}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Subcategories</MenuItem>
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={showInactive}
                label="Status"
                onChange={(e) => setShowInactive(e.target.value)}
              >
                <MenuItem value={false}>Active Only</MenuItem>
                <MenuItem value={true}>Include Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Total: {materials.length} items
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={handleOpenAllEntriesModal}
              fullWidth
            >
              View All Entries
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && materials.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Table */}
      {!loading && materials.length > 0 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item Code</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subcategory</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Supplier</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Current Stock</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Min Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Reorder</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMaterials.map((material, index) => (
                  <TableRow
                    key={material._id}
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      backgroundColor: index % 2 === 0 ? 'background.default' : 'action.hover',
                      opacity: material.isActive === false ? 0.6 : 1,
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {material.itemCode}
                      {material.isActive === false && (
                        <Chip label="Inactive" size="small" color="default" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>{material.itemName}</TableCell>
                    <TableCell>{material.subcategory || '-'}</TableCell>
                    <TableCell>{material.supplier || '-'}</TableCell>
                    <TableCell align="center">
                      <strong>{material.currentStock || 0}</strong> {material.unit || 'Kg'}
                    </TableCell>
                    <TableCell align="center">
                      {material.minStockLevel || 0} {material.unit || 'Kg'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStockStatusLabel(material.stockStatus)}
                        color={getStockStatusColor(material.stockStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={material.needsReorder ? 'Yes' : 'No'}
                        color={material.needsReorder ? 'warning' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{material.remarks || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Add Entry">
                        <IconButton
                          color="success"
                          onClick={() => handleOpenEntryModal(material)}
                          size="small"
                        >
                          <PostAddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetails(material)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(material)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(material._id)}
                          size="small"
                          disabled={material.isActive === false}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={materials.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {!loading && materials.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <InventoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No raw materials found. Add one to get started!
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Material Modal with Stock Adjustment */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1.5 }}>
          {isEditMode ? 'Edit Raw Material' : 'Add Raw Material'}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            
            <Typography variant="h6" sx={{ mt: 1 }}>Material Details</Typography>
            <Divider />

            {/* Material Details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Item Name"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!formData.itemName}
                  helperText={!formData.itemName ? 'Required field' : ''}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Item Code"
                  name="itemCode"
                  value={formData.itemCode}
                  placeholder="PET_CHIPS"
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={isEditMode}
                  error={!formData.itemCode}
                  helperText={
                    !formData.itemCode
                      ? 'Required field'
                      : isEditMode
                      ? 'Cannot be changed'
                      : 'Format: UPPERCASE_WITH_UNDERSCORES (e.g., PET_CHIPS)'
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    label="Unit"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Gm">Gm</MenuItem>
                    <MenuItem value="Nos">Nos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Minimum Stock Level"
                  name="minStockLevel"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={handleInputChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
            />

            {/* Stock Adjustment Section - Only in Edit Mode */}
            {isEditMode && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Stock Adjustment (Optional)</Typography>
                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Adjustment Type</InputLabel>
                      <Select
                        name="adjustmentType"
                        value={stockAdjustmentData.adjustmentType}
                        label="Adjustment Type"
                        onChange={handleStockAdjustmentChange}
                      >
                        <MenuItem value="addition">Addition</MenuItem>
                        {/* <MenuItem value="reduction">Reduction</MenuItem> */}
                        <MenuItem value="set">Set to Value</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={stockAdjustmentData.quantity}
                      onChange={handleStockAdjustmentChange}
                      fullWidth
                      inputProps={{ min: 0, step: 0.01 }}
                      helperText={
                        stockAdjustmentData.adjustmentType === 'addition' ? 'Amount to add' :
                        stockAdjustmentData.adjustmentType === 'reduction' ? 'Amount to subtract' :
                        'Set stock to this value'
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Reason"
                      name="reason"
                      value={stockAdjustmentData.reason}
                      onChange={handleStockAdjustmentChange}
                      fullWidth
                      placeholder="e.g., Stock reconciliation"
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Stock Adjustment Remarks"
                  name="stockRemarks"
                  value={stockAdjustmentData.stockRemarks}
                  onChange={handleStockAdjustmentChange}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Additional notes about the stock adjustment"
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.itemName || !formData.itemCode}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inward Entry Modal */}
      <Dialog open={isEntryModalOpen} onClose={handleCloseEntryModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Add Inward Entry</span>
          <IconButton onClick={handleCloseEntryModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedMaterialForEntry && (
            <>
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" color="text.secondary">Selected Material</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {selectedMaterialForEntry.itemName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Code: {selectedMaterialForEntry.itemCode} | Current Stock: {selectedMaterialForEntry.currentStock || 0} {selectedMaterialForEntry.unit}
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Quantity (Kg/Gm/Nos)"
                  name="quantityKg"
                  type="number"
                  value={entryFormData.quantityKg}
                  onChange={handleEntryInputChange}
                  fullWidth
                  required
                  inputProps={{ min: 0.01, step: 0.01 }}
                  error={!entryFormData.quantityKg}
                  helperText={!entryFormData.quantityKg ? 'Required field' : ''}
                />

                <TextField
                  label="Remarks"
                  name="remarks"
                  value={entryFormData.remarks}
                  onChange={handleEntryInputChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Optional remarks"
                />
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEntryModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSaveEntry}
            variant="contained"
            disabled={loading || !entryFormData.quantityKg}
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* All Entries Modal */}
      <Dialog open={isAllEntriesModalOpen} onClose={handleCloseAllEntriesModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HistoryIcon />
            <span>All Inward Entries</span>
          </Box>
          <IconButton onClick={handleCloseAllEntriesModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {entriesLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : allEntries.length > 0 ? (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Material Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item Code</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Quantity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entered By</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEntries.map((entry, index) => (
                      <TableRow
                        key={entry._id}
                        sx={{
                          '&:hover': { backgroundColor: 'action.hover' },
                          backgroundColor: index % 2 === 0 ? 'background.default' : 'action.hover',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>
                          {entry.rawMaterial?.itemName || 'N/A'}
                        </TableCell>
                        <TableCell>{entry.rawMaterial?.itemCode || 'N/A'}</TableCell>
                        <TableCell align="center">
                          <strong>{entry.quantityKg}</strong> {entry.rawMaterial?.unit || 'Kg'}
                        </TableCell>
                        <TableCell>{entry.remarks || '-'}</TableCell>
                        <TableCell>{entry.enteredBy?.name || 'N/A'}</TableCell>
                        <TableCell>{formatDate(entry.entryDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 50]}
                component="div"
                count={allEntries.length}
                rowsPerPage={entriesRowsPerPage}
                page={entriesPage}
                onPageChange={handleEntriesChangePage}
                onRowsPerPageChange={handleEntriesChangeRowsPerPage}
              />
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HistoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No inward entries found
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAllEntriesModal} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Material Details</span>
          <IconButton onClick={handleCloseDetails} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {detailsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
            </Box>
          ) : materialDetails ? (
            <Box>
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Item Code</Typography>
                    <Typography variant="body1" fontWeight="bold">{materialDetails.itemCode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Item Name</Typography>
                    <Typography variant="body1" fontWeight="bold">{materialDetails.itemName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Current Stock</Typography>
                    <Typography variant="h6" color="primary">{materialDetails.currentStock || 0} {materialDetails.unit}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Stock Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={getStockStatusLabel(materialDetails.stockStatus)}
                        color={getStockStatusColor(materialDetails.stockStatus)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={detailsTab} onChange={(e, newValue) => setDetailsTab(newValue)}>
                  <Tab label={`Recent Entries (${materialDetails.recentEntries?.length || 0})`} />
                  <Tab label={`Usage History (${materialDetails.usageHistory?.length || 0})`} />
                </Tabs>
              </Box>

              {detailsTab === 0 && (
                <Box>
                  {materialDetails.recentEntries && materialDetails.recentEntries.length > 0 ? (
                    <List>
                      {materialDetails.recentEntries.map((entry) => (
                        <React.Fragment key={entry._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" fontWeight="medium">
                                    {entry.quantityKg} Kg
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(entry.entryDate)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Entered by: {entry.enteredBy?.name || 'Unknown'}
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No recent entries found</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {detailsTab === 1 && (
                <Box>
                  {materialDetails.usageHistory && materialDetails.usageHistory.length > 0 ? (
                    <List>
                      {materialDetails.usageHistory.map((usage) => (
                        <React.Fragment key={usage._id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" fontWeight="medium">
                                    Used: {usage.usedRawMaterialKg} Kg
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(usage.productionDate)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Production outcomes: {usage.outcomes?.length || 0} items
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No usage history found</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No details available</Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDetails} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}