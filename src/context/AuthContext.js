import React, { createContext, useState, useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Tạo context
const AuthContext = createContext(null);

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu đã có token và user trong localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  // Hàm đăng nhập lưu token và user data
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    return true;
  };

  // Hàm đăng xuất thực sự
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Kiểm tra đã đăng nhập chưa - kiểm tra token thực
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Route protector component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default AuthContext; 