import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { positions } from '../services/api';

// Mocked data as fallback
const mockPositions = [
  { id: 1, name: 'Giám đốc', department: 'Ban điều hành', employeeCount: 1, salary: '50,000,000 VND' },
  { id: 2, name: 'Trưởng phòng', department: 'Quản lý', employeeCount: 4, salary: '30,000,000 VND' },
  { id: 3, name: 'Nhân viên IT', department: 'Phòng IT', employeeCount: 8, salary: '20,000,000 VND' },
  { id: 4, name: 'Kế toán', department: 'Phòng Kế toán', employeeCount: 3, salary: '18,000,000 VND' },
];

const Positions = () => {
  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await positions.getAll();
      if (response && response.data) {
        console.log('Position data from API:', response.data);
        setPositionData(response.data);
      } else {
        console.warn('No data received from API, using mock data');
        setPositionData(mockPositions);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      setError('Không thể kết nối đến máy chủ. Sử dụng dữ liệu mẫu.');
      setPositionData(mockPositions);
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

  const handleOpenDialog = (position = null) => {
    setCurrentPosition(position);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPosition(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSavePosition = async () => {
    // Implementation for saving position data
    handleCloseDialog();
    // Refetch data after save
    fetchPositions();
  };

  const handleDeletePosition = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chức vụ này?')) {
      try {
        await positions.delete(id);
        fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
        setError('Không thể xóa chức vụ');
      }
    }
  };

  const filteredPositions = positionData.filter(position =>
    (position.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (position.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract the fields we need based on API response structure
  const mapPositionData = (position) => {
    // Adapt this mapping based on your actual API response structure
    return {
      id: position.id || position.maCV,
      name: position.name || position.tenCV || '',
      department: position.department || position.phongBan || '',
      employeeCount: position.employeeCount || position.soNhanVien || 0,
      salary: position.salary || position.luong || '',
    };
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Danh sách chức vụ
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm mới
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã chức vụ</TableCell>
                  <TableCell>Tên chức vụ</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Số nhân viên</TableCell>
                  <TableCell>Mức lương</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPositions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((position) => {
                    const mappedPosition = mapPositionData(position);
                    return (
                      <TableRow key={mappedPosition.id}>
                        <TableCell>{mappedPosition.id}</TableCell>
                        <TableCell>{mappedPosition.name}</TableCell>
                        <TableCell>{mappedPosition.department}</TableCell>
                        <TableCell>{mappedPosition.employeeCount}</TableCell>
                        <TableCell>{mappedPosition.salary}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleOpenDialog(position)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeletePosition(mappedPosition.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredPositions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không tìm thấy chức vụ nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPositions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentPosition ? 'Sửa thông tin chức vụ' : 'Thêm chức vụ mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Tên chức vụ" 
                variant="outlined"
                defaultValue={currentPosition ? mapPositionData(currentPosition).name : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Phòng ban" 
                variant="outlined"
                defaultValue={currentPosition ? mapPositionData(currentPosition).department : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Mức lương" 
                variant="outlined"
                defaultValue={currentPosition ? mapPositionData(currentPosition).salary : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSavePosition}>
            {currentPosition ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Positions; 