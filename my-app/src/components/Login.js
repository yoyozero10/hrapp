import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/api';

// Login component
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsServerDown(false);
    
    // Thiết lập timeout để tránh treo vô thời hạn
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setIsServerDown(true);
      setError('Không thể kết nối đến máy chủ trong thời gian cho phép (15s). Máy chủ có thể đang ngủ hoặc không hoạt động.');
    }, 15000);
    
    try {
      // Gọi API đăng nhập
      let response;
      
      try {
        // Thử đăng nhập với API thật
        response = await auth.login(username, password);
        console.log('Login response:', response);
        
        // Xóa timeout vì đã nhận phản hồi
        clearTimeout(timeoutId);
        
        if (response && response.data) {
          // Lưu token vào localStorage
          const token = response.data.token || response.data.access_token;
          if (token) {
            localStorage.setItem('token', token);
            
            // Nếu có thông tin user thì lưu
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            // Cập nhật context
            login(response.data.user, token);
            
            // Chuyển hướng sau khi đăng nhập thành công
            setRedirect(true);
          } else {
            setError('Không tìm thấy token trong phản hồi từ máy chủ');
          }
        } else {
          setError('Phản hồi không hợp lệ từ máy chủ');
        }
      } catch (apiError) {
        // Xóa timeout vì đã nhận phản hồi lỗi
        clearTimeout(timeoutId);
        
        console.error('API login failed:', apiError);
        
        // Kiểm tra lỗi cụ thể
        if (apiError.message && apiError.message.includes('Network Error')) {
          setIsServerDown(true);
          setError('Không thể kết nối đến máy chủ. Máy chủ có thể đang ngủ hoặc không hoạt động.');
        } else if (apiError.response && apiError.response.status === 401) {
          setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } else if (apiError.response && apiError.response.data && apiError.response.data.message) {
          setError(apiError.response.data.message);
        } else {
          setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
        }
        
        // Thử xem có muốn dùng fake login không
        if (isServerDown) {
          try {
            // Nếu API thật thất bại do máy chủ không hoạt động, thử fake login
            response = await auth.fakeLogin(username, password);
            console.log('Fake login response:', response);
            
            if (response && response.data) {
              // Lưu token vào localStorage
              const token = response.data.token || response.data.access_token;
              if (token) {
                localStorage.setItem('token', token);
                
                // Nếu có thông tin user thì lưu
                if (response.data.user) {
                  localStorage.setItem('user', JSON.stringify(response.data.user));
                }
                
                // Cập nhật context
                login(response.data.user, token);
                
                // Chuyển hướng sau khi đăng nhập thành công
                setRedirect(true);
              }
            }
          } catch (fakeError) {
            console.error('Fake login also failed:', fakeError);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
          }
        }
      }
    } catch (error) {
      // Xóa timeout vì đã nhận phản hồi lỗi
      clearTimeout(timeoutId);
      
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  // Nếu đã đăng nhập thành công, chuyển hướng đến dashboard
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
        
        {isServerDown && (
          <Alert severity="warning" sx={{ width: '100%', mt: 2 }}>
            Server có thể đang ở chế độ ngủ. Vui lòng thử lại sau vài phút để đánh thức máy chủ.
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
          
          {isServerDown && (
            <Typography variant="body2" color="textSecondary" align="center">
              Bạn có thể đăng nhập bằng tài khoản mẫu: user/user hoặc admin/admin
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 