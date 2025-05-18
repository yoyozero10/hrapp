import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';

// Components
import Dashboard from './components/Dashboard';
import MainLayout from './components/Layout/MainLayout';
import Login from './components/Login';

// Styles
import './App.css';

// Create a custom dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#555555',
    },
    background: {
      default: '#13151a',
      paper: '#1a1d24',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
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
            {/* Auth routes - Use the Login component */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } 
            />
            
            {/* Management routes */}
            <Route 
              path="/employees" 
              element={
                <MainLayout>
                  <div>Danh sách nhân viên</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/departments" 
              element={
                <MainLayout>
                  <div>Danh sách phòng ban</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/positions" 
              element={
                <MainLayout>
                  <div>Danh sách chức vụ</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/divisions" 
              element={
                <MainLayout>
                  <div>Danh sách bộ phận</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/qualifications" 
              element={
                <MainLayout>
                  <div>Danh sách trình độ</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/insurance" 
              element={
                <MainLayout>
                  <div>Danh sách bảo hiểm</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/contracts" 
              element={
                <MainLayout>
                  <div>Danh sách hợp đồng</div>
                </MainLayout>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <MainLayout>
                  <div>Hồ sơ cá nhân</div>
                </MainLayout>
              } 
            />
            
            {/* Redirect root to dashboard directly */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 