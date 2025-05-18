"use client"

import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material';
import { Navigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Login component with dark UI matching the Vietnamese interface in the screenshot
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect to dashboard after login attempt
  const handleLogin = (e) => {
    e.preventDefault();
    setRedirectToDashboard(true);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If redirect flag is true, navigate to dashboard
  if (redirectToDashboard) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      bgcolor: '#111', 
      padding: 2 
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 400,
        bgcolor: '#24292e',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="h1" sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            mb: 2,
            color: 'white' 
          }}>
            Đăng nhập
          </Typography>
          
          {/* Error Alert */}
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4, 
              bgcolor: '#473a11', 
              color: '#f5d87c',
              '.MuiAlert-icon': { color: '#f5d87c' }
            }}
          >
            <AlertTitle>Không thể kết nối đến máy chủ</AlertTitle>
            Hệ thống sẽ sử dụng dữ liệu mẫu nếu đăng nhập thất bại.
            <Box sx={{ mt: 1 }}>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#f5d87c',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto'
                }}
              >
                Kiểm tra kết nối lại
              </Button>
            </Box>
          </Alert>
          
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                mb: 1, 
                fontWeight: 'medium',
                color: 'white'
              }}>
                Tên đăng nhập *
              </Typography>
              <TextField
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 3,
                  '.MuiOutlinedInput-root': {
                    backgroundColor: '#24292e',
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#999',
                    },
                  },
                  input: { color: 'white' }
                }}
              />
            
              <Typography variant="subtitle2" sx={{ 
                mb: 1, 
                fontWeight: 'medium',
                color: 'white'
              }}>
                Mật khẩu *
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  mb: 3,
                  '.MuiOutlinedInput-root': {
                    backgroundColor: '#24292e',
                    color: 'white',
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#777',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#999',
                    },
                  },
                  input: { color: 'white' }
                }}
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
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mb: 2, 
                bgcolor: '#fff', 
                color: '#000',
                '&:hover': { bgcolor: '#e0e0e0' },
                py: 1,
                fontWeight: 'bold'
              }}
            >
              ĐĂNG NHẬP
            </Button>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                textAlign: 'center',
                color: '#bbb'
              }}
            >
              Máy chủ không khả dụng. Bạn vẫn có thể đăng nhập bằng tài khoản mẫu: user/user hoặc admin/admin
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 