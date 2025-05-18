import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true);
  const [loading, setLoading] = useState(false);

  // On initial load, automatically set user as authenticated
  useEffect(() => {
    // Always set the user to true - automatic authentication
    setUser(true);
    setLoading(false);
  }, []);

  // No real login functionality needed since all users are automatically authenticated
  const login = async (credentials) => {
    setLoading(true);
    // Always succeed
    setUser(true);
    setLoading(false);
    return true;
  };

  const logout = () => {
    // No real need to log out, but keeping the function for API consistency
    // In reality, the user will always remain authenticated
    setUser(true);
  };

  // Provide auth context values
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: true // Always return true
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 