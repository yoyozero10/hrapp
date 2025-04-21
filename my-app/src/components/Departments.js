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
import { departments } from '../services/api';

// Mocked data as fallback
const mockDepartments = [
  { id: 1, name: 'Phòng IT', manager: 'Nguyen Van A', employeeCount: 12, location: 'Tầng 2' },
  { id: 2, name: 'Phòng Nhân sự', manager: 'Tran Thi B', employeeCount: 8, location: 'Tầng 3' },
  { id: 3, name: 'Phòng Kế toán', manager: 'Le Van C', employeeCount: 5, location: 'Tầng 1' },
  { id: 4, name: 'Phòng Marketing', manager: 'Pham Thi D', employeeCount: 6, location: 'Tầng 2' },
];

const Departments = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departments.getAll();
      if (response && response.data) {
        console.log('Department data from API:', response.data);
        setDepartmentData(response.data);
      } else {
        console.warn('No data received from API, using mock data');
        setDepartmentData(mockDepartments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Không thể kết nối đến máy chủ. Sử dụng dữ liệu mẫu.');
      setDepartmentData(mockDepartments);
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

  const handleOpenDialog = (department = null) => {
    setCurrentDepartment(department);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDepartment(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSaveDepartment = async () => {
    // Implementation for saving department data
    handleCloseDialog();
    // Refetch data after save
    fetchDepartments();
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
      try {
        await departments.delete(id);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        setError('Không thể xóa phòng ban');
      }
    }
  };

  const filteredDepartments = departmentData.filter(department =>
    (department.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (department.manager || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (department.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract the fields we need based on API response structure
  const mapDepartmentData = (department) => {
    // Adapt this mapping based on your actual API response structure
    return {
      id: department.id || department.maPB,
      name: department.name || department.tenPB || '',
      manager: department.manager || department.truongPhong || '',
      employeeCount: department.employeeCount || department.soNhanVien || 0,
      location: department.location || department.diaDiem || '',
    };
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Danh sách phòng ban
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
                  <TableCell>Mã PB</TableCell>
                  <TableCell>Tên phòng ban</TableCell>
                  <TableCell>Trưởng phòng</TableCell>
                  <TableCell>Số nhân viên</TableCell>
                  <TableCell>Vị trí</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDepartments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((department) => {
                    const mappedDepartment = mapDepartmentData(department);
                    return (
                      <TableRow key={mappedDepartment.id}>
                        <TableCell>{mappedDepartment.id}</TableCell>
                        <TableCell>{mappedDepartment.name}</TableCell>
                        <TableCell>{mappedDepartment.manager}</TableCell>
                        <TableCell>{mappedDepartment.employeeCount}</TableCell>
                        <TableCell>{mappedDepartment.location}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleOpenDialog(department)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteDepartment(mappedDepartment.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredDepartments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không tìm thấy phòng ban nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDepartments.length}
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
          {currentDepartment ? 'Sửa thông tin phòng ban' : 'Thêm phòng ban mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Tên phòng ban" 
                variant="outlined"
                defaultValue={currentDepartment ? mapDepartmentData(currentDepartment).name : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Trưởng phòng" 
                variant="outlined"
                defaultValue={currentDepartment ? mapDepartmentData(currentDepartment).manager : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Vị trí" 
                variant="outlined"
                defaultValue={currentDepartment ? mapDepartmentData(currentDepartment).location : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveDepartment}>
            {currentDepartment ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Departments; 