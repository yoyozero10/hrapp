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
import { employees } from '../services/api';

// Mocked data as fallback
const mockEmployees = [
  { id: 1, name: 'Nguyen Van A', department: 'IT', position: 'Developer', phone: '0123456789', email: 'a@example.com' },
  { id: 2, name: 'Tran Thi B', department: 'HR', position: 'Manager', phone: '0987654321', email: 'b@example.com' },
  { id: 3, name: 'Le Van C', department: 'Finance', position: 'Accountant', phone: '0555555555', email: 'c@example.com' },
];

const Employees = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employees.getAll();
      if (response && response.data) {
        console.log('Employee data from API:', response.data);
        setEmployeeData(response.data);
      } else {
        console.warn('No data received from API, using mock data');
        setEmployeeData(mockEmployees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Không thể kết nối đến máy chủ. Sử dụng dữ liệu mẫu.');
      setEmployeeData(mockEmployees);
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

  const handleOpenDialog = (employee = null) => {
    setCurrentEmployee(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmployee(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSaveEmployee = async () => {
    // Implementation for saving employee data
    handleCloseDialog();
    // Refetch data after save
    fetchEmployees();
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await employees.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Không thể xóa nhân viên');
      }
    }
  };

  const filteredEmployees = employeeData.filter(employee =>
    (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract the fields we need based on API response structure
  const mapEmployeeData = (employee) => {
    // Adapt this mapping based on your actual API response structure
    return {
      id: employee.id || employee.maNV,
      name: employee.name || employee.hoTen || '',
      department: employee.department || employee.tenPB || '',
      position: employee.position || employee.tenCV || '',
      phone: employee.phone || employee.soDT || '',
      email: employee.email || '',
    };
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Danh sách nhân viên
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
                  <TableCell>Mã NV</TableCell>
                  <TableCell>Họ và tên</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Chức vụ</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => {
                    const mappedEmployee = mapEmployeeData(employee);
                    return (
                      <TableRow key={mappedEmployee.id}>
                        <TableCell>{mappedEmployee.id}</TableCell>
                        <TableCell>{mappedEmployee.name}</TableCell>
                        <TableCell>{mappedEmployee.department}</TableCell>
                        <TableCell>{mappedEmployee.position}</TableCell>
                        <TableCell>{mappedEmployee.phone}</TableCell>
                        <TableCell>{mappedEmployee.email}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary" 
                            onClick={() => handleOpenDialog(employee)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteEmployee(mappedEmployee.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không tìm thấy nhân viên nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentEmployee ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Họ và tên" 
                variant="outlined"
                defaultValue={currentEmployee ? mapEmployeeData(currentEmployee).name : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Phòng ban" 
                variant="outlined"
                defaultValue={currentEmployee ? mapEmployeeData(currentEmployee).department : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Chức vụ" 
                variant="outlined"
                defaultValue={currentEmployee ? mapEmployeeData(currentEmployee).position : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Số điện thoại" 
                variant="outlined"
                defaultValue={currentEmployee ? mapEmployeeData(currentEmployee).phone : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Email" 
                type="email"
                variant="outlined"
                defaultValue={currentEmployee ? mapEmployeeData(currentEmployee).email : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveEmployee}>
            {currentEmployee ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Employees; 