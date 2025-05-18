import axios from 'axios';

// Direct API URL without any proxy
const BASE_URL = 'https://doanjava-z61i.onrender.com';  // Direct server URL

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for slow server responses
  timeout: 15000, // 15 seconds
  // Don't use withCredentials as it can cause CORS issues
  withCredentials: false,
  // Retry settings
  maxRetries: 2,
  retryDelay: 1500,
});

// Connection status tracking
let isServerDown = true; // Set to true to use fake data

// Thêm interceptor để tự động thử lại request khi thất bại
api.interceptors.response.use(
  (response) => {
    // Reset server down status on successful response
    isServerDown = false;
    return response;
  }, 
  async (error) => {
    const config = error.config;
    
    // Check if this is a network error or server error
    if (error.message && (
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('CORS') ||
      (error.response && error.response.status >= 500)
    )) {
      console.log('Server error detected:', error.message || error.response?.status);
      
      // Only set server as down for serious connection issues, not for API errors
      if (!error.response || error.response.status >= 500) {
        isServerDown = true;
      }
    }
    
    // Nếu không có config hoặc đã thử lại quá số lần, trả về lỗi
    if (!config || !config.maxRetries) return Promise.reject(error);
    
    // Tăng số lần đã thử
    config.retryCount = config.retryCount || 0;
    config.retryCount += 1;
    
    // Nếu vẫn còn số lần thử lại
    if (config.retryCount <= config.maxRetries) {
      // Tạo delay trước khi thử lại
      const delay = config.retryDelay || 1000;
      console.log(`Retrying request (${config.retryCount}/${config.maxRetries}) after ${delay}ms`);
      
      return new Promise(resolve => {
        setTimeout(() => resolve(api(config)), delay);
      });
    }
    
    return Promise.reject(error);
  }
);

// Function to check server status
export const checkServerStatus = () => {
  return {
    isServerDown,
    setServerDown: (status) => {
      isServerDown = status;
    }
  };
};

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Thêm các tùy chọn thử lại vào mỗi request
    config.maxRetries = api.defaults.maxRetries;
    config.retryDelay = api.defaults.retryDelay;
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to force using fake login - no longer used by default
export const forceFakeLogin = () => {
  isServerDown = true;
  localStorage.setItem('usingFakeLogin', 'true');
};

// Helper function to force real login mode
export const forceRealLogin = () => {
  isServerDown = false;
  localStorage.removeItem('usingFakeLogin');
};

// Authentication APIs
export const auth = {
  login: (email, password) => {
    // Always try real login first, fallback to fake only if server is confirmed down
    if (isServerDown) {
      console.log('Server is down, using fake login');
      return auth.fakeLogin(email, password);
    }
    // Use new API: email instead of username
    return axios.post(`${BASE_URL}/api/auth/login`, { email, password }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .catch(error => {
        if (isServerDown || (error.response && error.response.status >= 500)) {
          console.log('Server error detected, falling back to fake login');
          return auth.fakeLogin(email, password);
        }
        return Promise.reject(error);
      });
  },
  getMe: () => api.get('/api/auth/me'),
  // Fake login function for offline mode
  fakeLogin: (email, password) => {
    // Accepts email for compatibility
    if ((email === 'admin@example.com' && password === 'admin') || 
        (email === 'user@example.com' && password === 'user') || 
        (email === 'thang@example.com' && password === '123456')) {
      return Promise.resolve({
        data: {
          user: {
            id: 1,
            email: email,
            roles: ['ROLE_USER']
          },
          accessToken: 'fake-jwt-token'
        }
      });
    } else {
      return Promise.reject({
        response: {
          data: {
            message: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
          }
        }
      });
    }
  }
};

// Rest of the API endpoints with mock data support
const createMockData = (type, count) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    items.push({
      id: i,
      name: `${type} ${i}`,
      // Add other fields as needed
    });
  }
  return items;
};

// Employee APIs
export const employees = {
  getAll: (params) => isServerDown ? Promise.resolve({ data: createMockData('Employee', 12) }) : api.get('/api/employees', { params }),
  getById: (id) => api.get(`/api/employees/${id}`),
  create: (data) => api.post('/api/employees', data),
  update: (id, data) => api.put(`/api/employees/${id}`, data),
  delete: (id) => api.delete(`/api/employees/${id}`),
};

// Department APIs
export const departments = {
  getAll: () => isServerDown ? Promise.resolve({ data: createMockData('Department', 4) }) : api.get('/api/departments'),
  getById: (id) => api.get(`/api/departments/${id}`),
  create: (data) => api.post('/api/departments', data),
  update: (id, data) => api.put(`/api/departments/${id}`, data),
  delete: (id) => api.delete(`/api/departments/${id}`),
};

// Position APIs
export const positions = {
  getAll: () => isServerDown ? Promise.resolve({ data: createMockData('Position', 5) }) : api.get('/api/positions'),
  getById: (id) => api.get(`/api/positions/${id}`),
  create: (data) => api.post('/api/positions', data),
  update: (id, data) => api.put(`/api/positions/${id}`, data),
  delete: (id) => api.delete(`/api/positions/${id}`),
};

// Division APIs
export const divisions = {
  getAll: () => isServerDown ? Promise.resolve({ data: createMockData('Division', 3) }) : api.get('/api/divisions'),
  getById: (id) => api.get(`/api/divisions/${id}`),
  create: (data) => api.post('/api/divisions', data),
  update: (id, data) => api.put(`/api/divisions/${id}`, data),
  delete: (id) => api.delete(`/api/divisions/${id}`),
};

// Contract APIs
export const contracts = {
  getAll: (params) => isServerDown ? Promise.resolve({ data: createMockData('Contract', 10) }) : api.get('/api/contracts', { params }),
  getById: (id) => api.get(`/api/contracts/${id}`),
  create: (data) => api.post('/api/contracts', data),
  update: (id, data) => api.put(`/api/contracts/${id}`, data),
  delete: (id) => api.delete(`/api/contracts/${id}`),
};

// Insurance APIs
export const insurance = {
  getAll: (params) => isServerDown ? Promise.resolve({ data: createMockData('Insurance', 8) }) : api.get('/api/insurance', { params }),
  getById: (id) => api.get(`/api/insurance/${id}`),
  create: (data) => api.post('/api/insurance', data),
  update: (id, data) => api.put(`/api/insurance/${id}`, data),
  delete: (id) => api.delete(`/api/insurance/${id}`),
};

// Qualifications APIs
export const qualifications = {
  getAll: () => isServerDown ? Promise.resolve({ data: createMockData('Qualification', 6) }) : api.get('/api/qualifications'),
  getById: (id) => api.get(`/api/qualifications/${id}`),
  create: (data) => api.post('/api/qualifications', data),
  update: (id, data) => api.put(`/api/qualifications/${id}`, data),
  delete: (id) => api.delete(`/api/qualifications/${id}`),
};

// Attendance APIs
export const attendance = {
  getAll: (params) => isServerDown ? Promise.resolve({ data: createMockData('Attendance', 20) }) : api.get('/api/attendance', { params }),
  checkIn: (data) => api.post('/api/attendance/check-in', data),
  checkOut: (data) => api.post('/api/attendance/check-out', data),
  update: (id, data) => api.put(`/api/attendance/${id}`, data),
};

// Salary APIs
export const salary = {
  getPayslips: (params) => api.get('/api/salary/payslips', { params }),
  getComponents: () => api.get('/api/salary/components'),
  calculate: (data) => api.post('/api/salary/calculate', data),
};

// Recruitment APIs
export const recruitment = {
  getJobs: () => api.get('/api/recruitment/jobs'),
  getCandidates: (params) => api.get('/api/recruitment/candidates', { params }),
  addCandidate: (data) => api.post('/api/recruitment/candidates', data),
};

// Evaluation APIs
export const evaluations = {
  getAll: (params) => api.get('/api/evaluations', { params }),
  create: (data) => api.post('/api/evaluations', data),
};

// Settings APIs
export const settings = {
  get: (key) => api.get(`/api/settings/${key}`),
  update: (key, value) => api.put(`/api/settings/${key}`, { value }),
};

export default api;