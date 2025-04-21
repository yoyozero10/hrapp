import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  People as PeopleIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { employees, departments, contracts, insurance } from '../services/api';

const StatCard = ({ title, count, icon, color }) => {
  return (
    <Paper
      className="card"
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" fontWeight="bold">
          {count}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          bgcolor: `${color}15`, 
          p: 1.5, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 35, color: color } })}
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    contracts: 0,
    insurance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesRes, departmentsRes, contractsRes, insuranceRes] = await Promise.all([
          employees.getAll(),
          departments.getAll(),
          contracts.getAll(),
          insurance.getAll()
        ]);

        setStats({
          employees: employeesRes.data?.length || 0,
          departments: departmentsRes.data?.length || 0,
          contracts: contractsRes.data?.length || 0,
          insurance: insuranceRes.data?.length || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ my: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tổng quan
        </Typography>
        <Typography color="text.secondary">
          Xin chào! Đây là hệ thống quản lý nhân sự của công ty.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Nhân viên" 
            count={stats.employees} 
            icon={<PeopleIcon />} 
            color="#3498db" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Phòng ban" 
            count={stats.departments} 
            icon={<BusinessIcon />} 
            color="#2ecc71" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Hợp đồng" 
            count={stats.contracts} 
            icon={<AssignmentIcon />} 
            color="#f39c12" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Bảo hiểm" 
            count={stats.insurance} 
            icon={<HealthAndSafetyIcon />} 
            color="#e74c3c" 
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>

        <Grid item xs={12}>
          <Paper className="card" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin hệ thống
            </Typography>
            <Typography paragraph>
              Hệ thống quản lý nhân sự giúp bạn quản lý toàn bộ thông tin về nhân viên, phòng ban,
              chức vụ, bộ phận, hợp đồng và bảo hiểm của công ty một cách hiệu quả.
            </Typography>
            <Typography paragraph>
              Sử dụng menu bên trái để truy cập vào các chức năng quản lý khác nhau.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 