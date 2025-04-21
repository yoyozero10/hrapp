import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Divider, 
  Alert,
  Button,
  Link
} from '@mui/material';
import { 
  People as PeopleIcon,
  Business as BusinessIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { employees, departments, contracts, insurance } from '../services/api';
import { runConnectionDiagnostics, getConnectionStatusMessage } from '../services/connectivity';

// Fallback sample data to use when the server is down
const SAMPLE_DATA = {
  employees: 12,
  departments: 4,
  contracts: 10,
  insurance: 8
};

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
  const [usingFakeData, setUsingFakeData] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Check connectivity when component mounts, with added retries
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        setConnectionStatus('checking');
        const results = await runConnectionDiagnostics();
        setDiagnosticResults(results);
        
        if (!results.serverConnected) {
          setConnectionStatus('failed');
          console.log('Server connectivity issues detected');
          
          // If we haven't retried too many times, try again after a delay
          if (retryCount < 2) {
            console.log(`Will retry connection check in 3 seconds (attempt ${retryCount + 1}/2)`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 3000);
          }
        } else {
          setConnectionStatus('connected');
          // Reset retry count on success
          setRetryCount(0);
        }
      } catch (error) {
        console.error('Connectivity check failed:', error);
        setConnectionStatus('failed');
      }
    };
    
    checkConnectivity();
  }, [retryCount]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    // Check if we're using fake login
    const usingFakeLogin = localStorage.getItem('usingFakeLogin') === 'true';
    
    try {
      // Try to get data from the real API
      let results;
      
      try {
        // Use Promise.allSettled to handle individual API failures
        results = await Promise.allSettled([
          employees.getAll(),
          departments.getAll(),
          contracts.getAll(),
          insurance.getAll()
        ]);
        
        // Check if all APIs failed with server errors
        const allFailed = results.every(result => 
          result.status === 'rejected' || 
          (result.value && result.value.status >= 500)
        );
        
        if (allFailed) {
          throw new Error('All API calls failed');
        }
        
        // Process results and handle any individual API failures
        const employeesRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const departmentsRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const contractsRes = results[2].status === 'fulfilled' ? results[2].value : null;
        const insuranceRes = results[3].status === 'fulfilled' ? results[3].value : null;
        
        // Check for partial failures
        const failedApis = results.filter(r => r.status === 'rejected');
        
        setStats({
          employees: employeesRes?.data?.length || 0,
          departments: departmentsRes?.data?.length || 0,
          contracts: contractsRes?.data?.length || 0,
          insurance: insuranceRes?.data?.length || 0
        });
        
        // If we got here with some successful calls, we're using real data
        setConnectionStatus('connected');
        setUsingFakeData(failedApis.length > 0); // If any API failed, we're using partial fake data
        
        // If some APIs failed but not all, show warning
        if (failedApis.length > 0) {
          setError(`Một số dữ liệu không thể tải. ${failedApis.length} API bị lỗi.`);
        }
      } catch (apiError) {
        // Server error or all API calls failed, fall back to sample data
        console.error('Error fetching from real API, falling back to sample data:', apiError);
        setConnectionStatus('failed');
        setUsingFakeData(true);
        setStats(SAMPLE_DATA);
        
        if (apiError.response && apiError.response.status) {
          setError(`Lỗi máy chủ (${apiError.response.status}). Đang sử dụng dữ liệu mẫu.`);
        } else {
          setError('Không thể kết nối đến máy chủ. Đang sử dụng dữ liệu mẫu.');
        }
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      
      // Fall back to sample data
      setUsingFakeData(true);
      setStats(SAMPLE_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [connectionStatus]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const runConnectionTest = async () => {
    setConnectionStatus('checking');
    setError(null);
    
    try {
      const results = await runConnectionDiagnostics();
      setDiagnosticResults(results);
      
      if (results.serverConnected) {
        setConnectionStatus('connected');
        // If server is now available, try to fetch real data
        await fetchData();
      } else {
        setConnectionStatus('failed');
        setError(getConnectionStatusMessage(results));
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('failed');
      setError('Lỗi kiểm tra kết nối. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Tổng quan
          </Typography>
          <Typography color="text.secondary">
            Xin chào! Đây là hệ thống quản lý nhân sự của công ty.
          </Typography>
        </div>
        <Button 
          startIcon={connectionStatus === 'checking' ? <CircularProgress size={20} /> : <RefreshIcon />} 
          variant="outlined" 
          onClick={fetchData}
          disabled={connectionStatus === 'checking'}
        >
          Làm mới
        </Button>
      </Box>

      {connectionStatus === 'failed' && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={runConnectionTest}>
              Kiểm tra lại
            </Button>
          }
          icon={<WarningIcon />}
        >
          {diagnosticResults 
            ? getConnectionStatusMessage(diagnosticResults) 
            : 'Không thể kết nối đến máy chủ dữ liệu.'}
        </Alert>
      )}

      {error && connectionStatus !== 'failed' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {usingFakeData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Đang hiển thị dữ liệu mẫu do không thể kết nối đến máy chủ hoặc bạn đã đăng nhập bằng tài khoản mẫu.
        </Alert>
      )}

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
            
            {connectionStatus === 'failed' && (
              <Box mt={2}>
                <Typography variant="body2" color="error">
                  Cảnh báo: Bạn đang làm việc ở chế độ ngoại tuyến với dữ liệu mẫu. Một số chức năng có thể không hoạt động.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 