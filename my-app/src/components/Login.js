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
  AlertTitle,
  CircularProgress,
  Link,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { auth, forceFakeLogin } from '../services/api';

// Login component - updated with dark theme design while preserving functionality
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [connectionIssue, setConnectionIssue] = useState(true);
  const [serverStatus, setServerStatus] = useState('offline');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  // Set application to use fake login mode
  useEffect(() => {
    forceFakeLogin();
    setServerStatus('offline');
    setConnectionIssue(true);
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Check if server is available
  const checkServerAvailability = async () => {
    setServerStatus('checking');
    
    try {
      // Try a lightweight API call to check server status using direct URL
      const response = await fetch('https://doanjava-z61i.onrender.com/api/trinhdo/getAll', { 
        method: 'GET',
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
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      setLoading(false);
      return;
    }
    
    try {
      // Try real login (auth.login will fall back to fake login if server errors occur)
      const response = await auth.login(email, password);
      console.log('Login response:', response);
      
      if (response && response.data) {
        // Save token to localStorage
        const token = response.data.accessToken;
        if (token) {
          localStorage.setItem('token', token);
          
          // Check if we're using fake login due to server issues
          if (response.data.user && response.data.user.email && 
              (response.data.user.email === 'admin@example.com' || response.data.user.email === 'user@example.com')) {
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
          setError('Email hoặc mật khẩu không đúng');
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
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      bgcolor: '#f5f5f5'
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 400,
        bgcolor: '#ffffff',
        color: '#333333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            align="center" 
            sx={{ fontWeight: 'bold', color: '#333333', mb: 2 }}
          >
            Đăng nhập
          </Typography>
          
          {(serverStatus === 'offline' || serverStatus === 'error') && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3 }}
            >
              <AlertTitle>Không thể kết nối đến máy chủ</AlertTitle>
              Hệ thống sẽ sử dụng dữ liệu mẫu nếu đăng nhập thất bại.
              <Box mt={1}>
                <Button 
                  onClick={checkServerAvailability}
                  sx={{ 
                    color: '#855c0e',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  Kiểm tra kết nối lại
                </Button>
              </Box>
            </Alert>
          )}
          
          {serverStatus === 'checking' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 3 }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: '#333333' }}>
              Email *
            </Typography>
            <TextField
              fullWidth
              required
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium', color: '#333333' }}>
              Mật khẩu *
            </Typography>
            <TextField
              fullWidth
              required
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: '#777' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mb: 2, 
                py: 1,
                fontWeight: 'bold'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => {
                localStorage.setItem('token', 'fake-token');
                localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }));
                login({ email: 'test@example.com' }, 'fake-token');
                setRedirect(true);
              }}
            >
              Bỏ qua đăng nhập
            </Button>
            
            {connectionIssue && (
              <Typography 
                variant="body2" 
                align="center"
                sx={{ color: '#666666' }}
              >
                Máy chủ không khả dụng. Bạn vẫn có thể đăng nhập bằng tài khoản mẫu: user/user hoặc admin/admin
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 