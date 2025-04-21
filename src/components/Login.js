import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { auth, forceRealLogin } from '../services/api';

// Login component - updated to prioritize real server connections
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [connectionIssue, setConnectionIssue] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  
  const { login } = useAuth();

  // Set application to use real login (not fake login)
  useEffect(() => {
    forceRealLogin();
    checkServerAvailability();
  }, []);

  // Check if server is available
  const checkServerAvailability = async () => {
    setServerStatus('checking');
    
    try {
      // Try a lightweight API call to check server status
      const response = await fetch('/api/nhanvien/getAll', { 
        method: 'HEAD',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setServerStatus('online');
        setConnectionIssue(false);
      } else if (response.status >= 500) {
        setServerStatus('error');
        setConnectionIssue(true);
      } else {
        setServerStatus('unknown');
        setConnectionIssue(false);
      }
    } catch (error) {
      console.error('Server availability check failed:', error);
      setServerStatus('offline');
      setConnectionIssue(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Validate inputs
    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      setLoading(false);
      return;
    }
    
    try {
      // Try real login (auth.login will fall back to fake login if server errors occur)
      const response = await auth.login(username, password);
      console.log('Login response:', response);
      
      if (response && response.data) {
        // Save token to localStorage
        const token = response.data.token || response.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
          
          // Check if we're using fake login due to server issues
          if (response.data.user && response.data.user.username && 
              (response.data.user.username === 'admin' || response.data.user.username === 'user')) {
            localStorage.setItem('usingFakeLogin', 'true');
            setConnectionIssue(true);
          } else {
            localStorage.removeItem('usingFakeLogin');
            setConnectionIssue(false);
          }
          
          // Save user info if available
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          // Update auth context
          login(response.data.user, token);
          
          // Redirect after successful login
          setRedirect(true);
        } else {
          setError('Token không tìm thấy trong phản hồi từ máy chủ');
        }
      } else {
        setError('Phản hồi không hợp lệ từ máy chủ');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setError('Tên đăng nhập hoặc mật khẩu không đúng');
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError(`Lỗi đăng nhập: ${error.response.status}`);
        }
      } else if (error.message && error.message.includes('Network Error')) {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
        setConnectionIssue(true);
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect to dashboard if login was successful
  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ 
        mt: 8, 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        
        {serverStatus === 'checking' && (
          <Alert severity="info" sx={{ width: '100%', mt: 2 }}>
            Đang kiểm tra kết nối đến máy chủ...
          </Alert>
        )}
        
        {serverStatus === 'online' && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            Kết nối đến máy chủ thành công.
          </Alert>
        )}
        
        {serverStatus === 'error' && (
          <Alert severity="warning" sx={{ width: '100%', mt: 2 }}>
            Máy chủ đang gặp lỗi (500). Hệ thống sẽ sử dụng dữ liệu mẫu nếu đăng nhập thất bại.
            <Box mt={1}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={checkServerAvailability}
                underline="hover"
              >
                Kiểm tra kết nối lại
              </Link>
            </Box>
          </Alert>
        )}
        
        {serverStatus === 'offline' && (
          <Alert severity="warning" sx={{ width: '100%', mt: 2 }}>
            Không thể kết nối đến máy chủ. Hệ thống sẽ sử dụng dữ liệu mẫu nếu đăng nhập thất bại.
            <Box mt={1}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={checkServerAvailability}
                underline="hover"
              >
                Kiểm tra kết nối lại
              </Link>
            </Box>
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Tên đăng nhập"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
          </Button>
          
          {connectionIssue && (
            <Typography variant="body2" color="textSecondary" align="center">
              Máy chủ không khả dụng. Bạn vẫn có thể đăng nhập bằng tài khoản mẫu: user/user hoặc admin/admin
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 