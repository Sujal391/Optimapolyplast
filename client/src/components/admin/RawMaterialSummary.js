import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Checkbox,
  Grid,
} from '@mui/material';
import { RefreshCw, Download, Copy } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import { getRawMaterialSummary } from '../../services/api/stock';

export default function RawMaterialSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSidebarOpen] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getRawMaterialSummary();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch summary');
      }
    } catch (err) {
      setError(err.message || 'Error fetching raw material summary');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSummary();
  };

  // Filter data based on search term
  const filteredData = data?.summary?.filter(item =>
    item.rawMaterial?.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rawMaterial?.itemCode?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;
    let aVal = a[sortBy] || 0;
    let bVal = b[sortBy] || 0;
    if (sortOrder === 'asc') return aVal - bVal;
    return bVal - aVal;
  });

  // Paginate data
  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };

  const exportToCSV = () => {
    const headers = ['Raw Material', 'Item Code', 'Remarks', 'Total Inward (Kg)', 'Total Used (Kg)', 'Available (Kg)', 'Wastage (%)', 'Created At'];
    const rows = sortedData.map(item => [
      item.rawMaterial?.itemName || '',
      item.rawMaterial?.itemCode || '',
      item.rawMaterial?.remarks || '',
      item.totalInwardKg || 0,
      item.totalUsedKg || 0,
      item.availableKg || 0,
      item.wastagePercent || 0,
      new Date(item.rawMaterial?.createdAt).toLocaleDateString('en-GB'),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raw-material-summary-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const copyToClipboard = () => {
    const headers = ['Raw Material', 'Item Code', 'Remarks', 'Total Inward (Kg)', 'Total Used (Kg)', 'Available (Kg)', 'Wastage (%)', 'Created At'];
    const rows = sortedData.map(item => [
      item.rawMaterial?.itemName || '',
      item.rawMaterial?.itemCode || '',
      item.rawMaterial?.remarks || '',
      item.totalInwardKg || 0,
      item.totalUsedKg || 0,
      item.availableKg || 0,
      item.wastagePercent || 0,
      new Date(item.rawMaterial?.createdAt).toLocaleDateString('en-GB'),
    ]);

    const text = [headers, ...rows].map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarMessage('Table copied to clipboard!');
      setShowSnackbar(true);
    });
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar isOpen={isSidebarOpen} />
      <Box sx={{ flex: 1, p: 3, backgroundColor: '#f5f5f5', transition: 'all 0.3s', ml: isSidebarOpen ? '16rem' : 0 }}>
      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Raw Material Summary
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Produced (Kg)
              </Typography>
              <Typography variant="h5">
                {(data?.overall?.totalProducedKg || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Wastage (Kg)
              </Typography>
              <Typography variant="h5">
                {(data?.overall?.totalWastageKg || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Materials
              </Typography>
              <Typography variant="h5">
                {data?.summary?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          size="small"
          sx={{ flex: 1, minWidth: '200px' }}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: '150px' }}
        >
          <MenuItem value=""><em>No Sort</em></MenuItem>
          <MenuItem value="totalInwardKg">Sort by Inward</MenuItem>
          <MenuItem value="totalUsedKg">Sort by Used</MenuItem>
          <MenuItem value="availableKg">Sort by Available</MenuItem>
          <MenuItem value="wastagePercent">Sort by Wastage %</MenuItem>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          size="small"
          sx={{ minWidth: '100px' }}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={exportToCSV}
        >
          Export CSV
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshCw size={18} />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        <Button
          variant="outlined"
          startIcon={<Copy size={18} />}
          onClick={copyToClipboard}
        >
          Copy
        </Button>
      </Box>

      {/* Table */}
      {sortedData.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No raw materials found. Start by adding raw materials to the system.
          </Typography>
        </Card>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell><strong>Raw Material</strong></TableCell>
                  <TableCell><strong>Remarks</strong></TableCell>
                  <TableCell align="right"><strong>Total Inward (Kg)</strong></TableCell>
                  <TableCell align="right"><strong>Total Used (Kg)</strong></TableCell>
                  <TableCell align="right"><strong>Available (Kg)</strong></TableCell>
                  <TableCell align="right"><strong>Wastage (%)</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {item.rawMaterial?.itemName || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.rawMaterial?.itemCode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.rawMaterial?.remarks || '-'}</TableCell>
                    <TableCell align="right">{(item.totalInwardKg || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{(item.totalUsedKg || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{(item.availableKg || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">{(item.wastagePercent || 0).toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(item.rawMaterial?.createdAt).toLocaleDateString('en-GB')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, sortedData.length)} of {sortedData.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Typography sx={{ px: 2, py: 1 }}>
                Page {page + 1} of {Math.ceil(sortedData.length / rowsPerPage)}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage(Math.min(Math.ceil(sortedData.length / rowsPerPage) - 1, page + 1))}
                disabled={page >= Math.ceil(sortedData.length / rowsPerPage) - 1}
              >
                Next
              </Button>
            </Box>
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ minWidth: '100px' }}
            >
              <MenuItem value={5}>5 / page</MenuItem>
              <MenuItem value={10}>10 / page</MenuItem>
              <MenuItem value={20}>20 / page</MenuItem>
              <MenuItem value={50}>50 / page</MenuItem>
            </Select>
          </Box>
        </>
      )}
      </Box>
    </div>
  );
}