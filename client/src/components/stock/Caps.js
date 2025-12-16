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
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { FaBottleDroplet } from 'react-icons/fa6';
import {
  addCap,
  getCaps,
  updateCapStock,
  deleteCap,
} from '../../services/api/stock';

export default function CapManagement() {
  const [caps, setCaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCapId, setCurrentCapId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [capToDelete, setCapToDelete] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [neckTypeFilter, setNeckTypeFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');

  // Form state for Add/Edit Cap
  const [formData, setFormData] = useState({
    neckType: '',
    size: '',
    color: '',
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

  // Available options
  const neckTypes = ['narrow neck', 'wide neck'];
  const sizes = ['20mm', '24mm', '28mm', '32mm', '38mm', '45mm', '53mm'];
  const colors = ['White', 'Blue', 'Red', 'Green', 'Yellow', 'Black', 'Transparent', 'Other'];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch caps when filters change
  useEffect(() => {
    fetchCaps();
  }, [debouncedSearch, neckTypeFilter, sizeFilter, colorFilter]);

  const fetchCaps = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (neckTypeFilter) params.neckType = neckTypeFilter;
      if (sizeFilter) params.size = sizeFilter;
      if (colorFilter) params.color = colorFilter;

      const response = await getCaps(params);
      
      if (response.success) {
        let capsData = response.data || [];
        
        // Filter by search query if provided
        if (debouncedSearch) {
          capsData = capsData.filter(cap => 
            cap.displayName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            cap.neckType.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            cap.size.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            cap.color.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }
        
        // Sort by display name
        const sortedCaps = capsData.sort((a, b) => 
          (a.displayName || '').localeCompare(b.displayName || '', undefined, { sensitivity: 'base' })
        );
        setCaps(sortedCaps);
      } else {
        setError('Failed to fetch caps');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch caps');
      console.error('Error fetching caps:', err);
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

  const handleOpenModal = (cap = null) => {
    if (cap) {
      setIsEditMode(true);
      setCurrentCapId(cap._id);
      setFormData({
        neckType: cap.neckType,
        size: cap.size,
        color: cap.color,
        quantityAvailable: cap.quantityAvailable || 0,
        remarks: cap.remarks || '',
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
      setCurrentCapId(null);
      setFormData({
        neckType: '',
        size: '',
        color: '',
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
    setCurrentCapId(null);
    setFormData({
      neckType: '',
      size: '',
      color: '',
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
    if (!formData.neckType || !formData.size || !formData.color) {
      setError('Neck Type, Size, and Color are required');
      return;
    }

    if (!isEditMode && (formData.quantityAvailable === '' || formData.quantityAvailable < 0)) {
        setError('Initial quantity is required and cannot be negative');
        return;
    }

    try {
      setLoading(true);
      setError('');
      
      let capUpdateSuccess = false;
      let stockAdjustmentSuccess = false;

      // Update cap details if changed or adding new
      if (!isEditMode) {
        const response = await addCap(formData);
        if (response.success) {
          capUpdateSuccess = true;
          setSuccess(response.message || 'Cap added successfully!');
        }
      }

      // Adjust stock if there's stock adjustment data
      if (isEditMode && hasStockAdjustment && stockAdjustmentData.quantityChange !== '' && parseFloat(stockAdjustmentData.quantityChange) >= 0) {
        const adjustmentPayload = {
          changeType: stockAdjustmentData.changeType,
          quantityChange: parseFloat(stockAdjustmentData.quantityChange),
          remarks: stockAdjustmentData.stockRemarks || 'Manual adjustment',
        };

        const stockResponse = await updateCapStock(currentCapId, adjustmentPayload);
        if (stockResponse.success) {
          stockAdjustmentSuccess = true;
        }
      }

      // Set success message
    if (isEditMode) {
    if (stockAdjustmentSuccess) {
        setSuccess('Cap stock updated successfully!');
    } else {
        setSuccess('No changes made');
    }
    } else {
    if (capUpdateSuccess) {
        setSuccess('Cap added successfully!');
    }
    }
      
      handleCloseModal();
      await fetchCaps();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} cap`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cap) => {
    setCapToDelete(cap);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!capToDelete) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await deleteCap(capToDelete._id);
      
      if (response.success) {
        setSuccess(response.message || 'Cap deleted successfully!');
        await fetchCaps();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete cap');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCapToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCapToDelete(null);
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

  const paginatedCaps = caps.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FaBottleDroplet style={{ fontSize: 40, color: '#1976d2' }} />
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Cap Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          size="large"
        >
          Add Cap
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search caps..."
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
              <InputLabel>Neck Type</InputLabel>
              <Select
                value={neckTypeFilter}
                label="Neck Type"
                sx={{ minWidth: 160 }}
                onChange={(e) => setNeckTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {neckTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={sizeFilter}
                label="Size"
                sx={{ minWidth: 160 }}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <MenuItem value="">All Sizes</MenuItem>
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={colorFilter}
                label="Color"
                sx={{ minWidth: 160 }}
                onChange={(e) => setColorFilter(e.target.value)}
              >
                <MenuItem value="">All Colors</MenuItem>
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Total: {caps.length} caps
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
      {loading && caps.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Table */}
      {!loading && caps.length > 0 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Display Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Neck Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Size</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Color</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Available Quantity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Remarks</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCaps.map((cap, index) => (
                  <TableRow
                    key={cap._id}
                    sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      backgroundColor: index % 2 === 0 ? 'background.default' : 'action.hover',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {cap.displayName}
                    </TableCell>
                    <TableCell>
                      <Chip label={cap.neckType} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={cap.size} size="small" color="secondary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={cap.color} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <strong>{cap.quantityAvailable || 0}</strong> Nos
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStockStatusLabel(cap.stockStatus)}
                        color={getStockStatusColor(cap.stockStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{cap.remarks || '-'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(cap)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(cap)}
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
            count={caps.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {!loading && caps.length === 0 && (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <FaBottleDroplet style={{ fontSize: 80, color: '#9e9e9e', marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary">
            No caps found. Add one to get started!
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Cap Modal with Stock Adjustment */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{isEditMode ? 'Edit Cap' : 'Add Cap'}</span>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            
            <Typography variant="h6" sx={{ mt: 1 }}>Cap Details</Typography>
            <Divider />

            {/* Cap Details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.neckType}>
                  <InputLabel>Neck Type</InputLabel>
                  <Select
                    name="neckType"
                    value={formData.neckType}
                    label="Neck Type"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  >
                    {neckTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {!formData.neckType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Required field
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.size}>
                  <InputLabel>Size</InputLabel>
                  <Select
                    name="size"
                    value={formData.size}
                    label="Size"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </Select>
                  {!formData.size && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      Required field
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!formData.color}>
                  <InputLabel>Color</InputLabel>
                  <Select
                    name="color"
                    value={formData.color}
                    label="Color"
                    onChange={handleInputChange}
                    disabled={isEditMode}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))}
                  </Select>
                  {!formData.color && (
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
                helperText="Number of caps available (in Nos)"
                error={formData.quantityAvailable < 0}
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
                      error={stockAdjustmentData.quantityChange !== '' && parseFloat(stockAdjustmentData.quantityChange) < 0}
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
            disabled={loading || !formData.neckType || !formData.size || !formData.color}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this cap?
          </Typography>
          
          {capToDelete && (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      bgcolor: "grey.50",
      borderLeft: 4,
      borderLeftColor: "error.main",
    }}
  >
    <Grid container spacing={2}>
      {/* LEFT SIDE */}
      <Grid item xs={6}>
        <Typography variant="caption" color="text.secondary">
          Neck Type:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {capToDelete.neckType}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="caption" color="text.secondary">
          Size:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {capToDelete.size}
        </Typography>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid item xs={6}>
        <Typography variant="caption" color="text.secondary">
          Color:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {capToDelete.color}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="caption" color="text.secondary">
          Available Quantity:
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          {capToDelete.quantityAvailable || 0} Nos
        </Typography>
      </Grid>
    </Grid>
  </Paper>
)}

          
          <Typography 
  variant="caption" 
  color="error.main" 
  sx={{ display: "flex", alignItems: "center", mt: 2, fontWeight: 600 }}
>
  <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />
  This action cannot be undone.
</Typography>

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel} 
            variant="outlined"
            disabled={loading}
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            size="large"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}