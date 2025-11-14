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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import {
  fetchRawMaterials,
  addRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
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
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    itemName: '',
    itemCode: '',
    subcategory: '',
    unit: 'Kg',
    supplier: '',
    minStockLevel: 0,
    remarks: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch raw materials on mount and when filters change
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
      const materialsData = response.data || [];
      
      // Sort by itemCode in ascending order
      const sortedMaterials = materialsData.sort((a, b) => 
        a.itemCode.localeCompare(b.itemCode, undefined, { numeric: true, sensitivity: 'base' })
      );
      setMaterials(sortedMaterials);
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
      
      if (isEditMode) {
        const response = await updateRawMaterial(currentMaterialId, formData);
        setSuccess('Raw material updated successfully!');
      } else {
        const response = await addRawMaterial(formData);
        setSuccess('Raw material added successfully!');
      }
      
      handleCloseModal();
      await fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} raw material`);
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
      await deleteRawMaterial(id);
      setSuccess('Raw material deleted successfully!');
      await fetchMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete raw material');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        return status;
    }
  };

  // Get unique categories for filter
  const uniqueCategories = [...new Set(materials.map(m => m.subcategory).filter(Boolean))];

  // Pagination
  const paginatedMaterials = materials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                sx={{ minWidth: 130 }}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Supplier</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Current Stock</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Min Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
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
                    <TableCell>{material.remarks || '-'}</TableCell>
                    <TableCell align="center">
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

      {/* Add/Edit Material Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="small">
        <DialogTitle sx={{ fontWeight: 600, pb: 1.5 }}>
          {isEditMode ? 'Edit Raw Material' : 'Add Raw Material'}
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Row 1 */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Item Name *"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Item Code *"
                  name="itemCode"
                  value={formData.itemCode}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={isEditMode}
                />
              </Grid>
            </Grid>

            {/* Row 2 */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    value={formData.unit}
                    label="Unit"
                    onChange={handleInputChange}
                    sx={{ minWidth: 225 }}
                  >
                    <MenuItem value="Kg">Kg</MenuItem>
                    <MenuItem value="Gm">Gm</MenuItem>
                    <MenuItem value="Nos">Nos</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Row 3 */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
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

            {/* Row 4 */}
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}