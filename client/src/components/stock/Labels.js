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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Label as LabelIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  addLabel,
  getLabels,
  updateLabelStock,
  deleteLabel,
} from '../../services/api/stock';

export default function LabelManagement() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLabelId, setCurrentLabelId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form state for Add/Edit Label
  const [formData, setFormData] = useState({
    bottleCategory: '',
    bottleName: '',
    quantityAvailable: 0,
    remarks: '',
  });

  // Stock Adjustment Form State
  const [stockAdjustmentData, setStockAdjustmentData] = useState({
    changeType: 'addition',
    quantityChange: '',
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

  // Fetch labels when filters change
  useEffect(() => {
    fetchLabels();
  }, [debouncedSearch, categoryFilter]);

  const fetchLabels = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (categoryFilter) params.bottleCategory = categoryFilter;

      const response = await getLabels(params);
      
      if (response.success) {
        let labelsData = response.data || [];
        
        // Filter by search query if provided
        if (debouncedSearch) {
          labelsData = labelsData.filter(label => 
            label.bottleName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            label.bottleCategory.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }
        
        // Sort by bottle name
        const sortedLabels = labelsData.sort((a, b) => 
          a.bottleName.localeCompare(b.bottleName, undefined, { sensitivity: 'base' })
        );
        setLabels(sortedLabels);
      } else {
        setError('Failed to fetch labels');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch labels');
      console.error('Error fetching labels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantityAvailable' ? Number(value) : value
    }));
  };

  const handleStockAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setStockAdjustmentData(prev => ({
      ...prev,
      [name]: name === 'quantityChange' ? value : value
    }));
    setHasStockAdjustment(true);
  };

  const handleOpenModal = (label = null) => {
    if (label) {
      setIsEditMode(true);
      setCurrentLabelId(label._id);
      setFormData({
        bottleCategory: label.bottleCategory,
        bottleName: label.bottleName,
        quantityAvailable: label.quantityAvailable || 0,
        remarks: label.remarks || '',
      });
      // Reset stock adjustment data
      setStockAdjustmentData({
        changeType: 'addition',
        quantityChange: '',
        stockRemarks: '',
      });
      setHasStockAdjustment(false);
    } else {
      setIsEditMode(false);
      setCurrentLabelId(null);
      setFormData({
        bottleCategory: '',
        bottleName: '',
        quantityAvailable: 0,
        remarks: '',
      });
      setStockAdjustmentData({
        changeType: 'addition',
        quantityChange: '',
        stockRemarks: '',
      });
      setHasStockAdjustment(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentLabelId(null);
    setFormData({
      bottleCategory: '',
      bottleName: '',
      quantityAvailable: 0,
      remarks: '',
    });
    setStockAdjustmentData({
      changeType: 'addition',
      quantityChange: '',
      stockRemarks: '',
    });
    setHasStockAdjustment(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.bottleCategory || !formData.bottleName) {
      setError('Bottle Category and Bottle Name are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      let labelUpdateSuccess = false;
      let stockAdjustmentSuccess = false;

      // Check if label details have changed
      const labelDataChanged = isEditMode && (
        labels.find(l => l._id === currentLabelId)?.bottleCategory !== formData.bottleCategory ||
        labels.find(l => l._id === currentLabelId)?.bottleName !== formData.bottleName ||
        labels.find(l => l._id === currentLabelId)?.remarks !== formData.remarks
      );

      // Update label details if changed or adding new
      if (!isEditMode) {
        const response = await addLabel(formData);
        if (response.success) {
          labelUpdateSuccess = true;
          setSuccess(response.message || 'Label added successfully!');
        }
      } else if (labelDataChanged) {
        // Note: You might need to add an update label endpoint
        // For now, we'll only handle stock adjustments in edit mode
        labelUpdateSuccess = true;
      }

      // Adjust stock if there's stock adjustment data
      if (isEditMode && hasStockAdjustment && stockAdjustmentData.quantityChange && parseFloat(stockAdjustmentData.quantityChange) > 0) {
        const adjustmentPayload = {
          changeType: stockAdjustmentData.changeType,
          quantityChange: parseFloat(stockAdjustmentData.quantityChange),
          remarks: stockAdjustmentData.stockRemarks || 'Manual adjustment',
        };

        const stockResponse = await updateLabelStock(currentLabelId, adjustmentPayload);
        if (stockResponse.success) {
          stockAdjustmentSuccess = true;
        }
      }

      // Set success message
      if (isEditMode) {
        if (stockAdjustmentSuccess) {
          setSuccess('Label stock updated successfully!');
        } else if (labelUpdateSuccess) {
          setSuccess('Label updated successfully!');
        }
      }
      
      handleCloseModal();
      await fetchLabels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} label`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this label?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await deleteLabel(id);
      
      if (response.success) {
        setSuccess(response.message || 'Label deleted successfully!');
        await fetchLabels();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete label');
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
        return status || 'Unknown';
    }
  };

  const uniqueCategories = [...new Set(labels.map(l => l.bottleCategory).filter(Boolean))];

  const paginatedLabels = labels.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LabelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Label Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          size="large"
        >
          Add Label
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name or category..."
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Bottle Category</InputLabel>
              <Select
                value={categoryFilter}
                sx={{ minWidth: 160 }}
                label="Bottle Category"
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
            <Typography variant="body2" color="text.secondary">
              Total: {labels.length} labels
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
      {loading && labels.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Table */}
      {!loading && labels.length > 0 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bottle Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Available Quantity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLabels.map((label, index) => (
                  <TableRow
                    key={label._id}
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      backgroundColor: index % 2 === 0 ? 'background.default' : 'action.hover',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {label.bottleName}
                    </TableCell>
                    <TableCell>
                      <Chip label={label.bottleCategory} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <strong>{label.quantityAvailable || 0}</strong> Nos
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStockStatusLabel(label.stockStatus)}
                        color={getStockStatusColor(label.stockStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{label.remarks || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(label)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(label._id)}
                          size="small"
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
            count={labels.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {!loading && labels.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <LabelIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No labels found. Add one to get started!
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Label Modal with Stock Adjustment */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{isEditMode ? 'Edit Label' : 'Add Label'}</span>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            
            <Typography variant="h6" sx={{ mt: 1 }}>Label Details</Typography>
            <Divider />

            {/* Label Details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bottle Name"
                  name="bottleName"
                  value={formData.bottleName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={isEditMode}
                  error={!formData.bottleName}
                  helperText={!formData.bottleName ? 'Required field' : isEditMode ? 'Cannot be changed' : ''}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.bottleCategory}>
                  <InputLabel>Bottle Category</InputLabel>
                  <Select
                    name="bottleCategory"
                    value={formData.bottleCategory}
                    label="Bottle Category"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  >
                    <MenuItem value="200ml">200ml</MenuItem>
                    <MenuItem value="500ml">500ml</MenuItem>
                    <MenuItem value="1L">1L</MenuItem>
                    <MenuItem value="2L">2L</MenuItem>
                    <MenuItem value="5L">5L</MenuItem>
                  </Select>
                  {!formData.bottleCategory && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Required field
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {!isEditMode && (
              <TextField
                label="Initial Quantity Available"
                name="quantityAvailable"
                type="number"
                value={formData.quantityAvailable}
                onChange={handleInputChange}
                fullWidth
                inputProps={{ min: 0 }}
                helperText="Number of labels available (in Nos)"
              />
            )}

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
                <Typography variant="h6" sx={{ mt: 2 }}>Stock Adjustment</Typography>
                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Change Type</InputLabel>
                      <Select
                        name="changeType"
                        value={stockAdjustmentData.changeType}
                        label="Change Type"
                        onChange={handleStockAdjustmentChange}
                      >
                        <MenuItem value="addition">Addition</MenuItem>
                        <MenuItem value="reduction">Reduction</MenuItem>
                        <MenuItem value="set">Set to Value</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Quantity Change"
                      name="quantityChange"
                      type="number"
                      value={stockAdjustmentData.quantityChange}
                      onChange={handleStockAdjustmentChange}
                      fullWidth
                      inputProps={{ min: 0 }}
                      helperText={
                        stockAdjustmentData.changeType === 'addition' ? 'Amount to add' :
                        stockAdjustmentData.changeType === 'reduction' ? 'Amount to subtract' :
                        'Set stock to this value'
                      }
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
            disabled={loading || !formData.bottleName || !formData.bottleCategory}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}