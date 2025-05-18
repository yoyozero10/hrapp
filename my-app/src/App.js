import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

// Components
import Dashboard from './components/Dashboard';
import MainLayout from './components/Layout/MainLayout';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Positions from './components/Positions';
import Login from './components/Login';

// Styles
import './App.css';

// Create a custom light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Login route - hiển thị component Login thực */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard route - bảo vệ bằng ProtectedRoute */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Management routes - bảo vệ bằng ProtectedRoute */}
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Employees />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/departments" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Departments />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/positions" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Positions />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/divisions" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Danh sách bộ phận</div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/qualifications" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Danh sách trình độ</div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/insurance" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Danh sách bảo hiểm</div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Danh sách hợp đồng</div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <div>Hồ sơ cá nhân</div>
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to login if not authenticated, otherwise to dashboard */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            {/* Redirect all unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
