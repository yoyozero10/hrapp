import axios from 'axios';

// Use direct server URL instead of proxy
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
let isServerDown = false; // Changed to false to prioritize real connections

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
  login: (username, password) => {
    // Always try real login first, fallback to fake only if server is confirmed down
    if (isServerDown) {
      console.log('Server is down, using fake login');
      return auth.fakeLogin(username, password);
    }
    
    return api.post('/api/auth/login', { username, password })
      .catch(error => {
        // If we get a real server error (not auth error), try fake login
        if (isServerDown || (error.response && error.response.status >= 500)) {
          console.log('Server error detected, falling back to fake login');
          return auth.fakeLogin(username, password);
        }
        
        // Otherwise forward the error (like 401 unauthorized)
        return Promise.reject(error);
      });
  },
  register: (userData) => api.post('/api/auth/register', userData),
  getAll: () => api.get('/api/auth/getAll'),
  // Fake login function để sử dụng khi API không hoạt động
  fakeLogin: (username, password) => {
    // Giả lập API trả về thành công với thông tin user và token
    if ((username === 'admin' && password === 'admin') || 
        (username === 'user' && password === 'user') || 
        (username === 'thang' && password === '123456')) {
      return Promise.resolve({
        data: {
          user: {
            id: 1,
            username: username,
            email: `${username}@example.com`,
            roles: ['ROLE_USER']
          },
          token: 'fake-jwt-token'
        }
      });
    } else {
      // Giả lập lỗi đăng nhập
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

// Employee APIs (Nhân viên)
export const employees = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Nhân viên', 12) });
    }
    return api.get('/api/nhanvien/getAll');
  },
  getById: (id) => {
    if (isServerDown) {
      return Promise.resolve({ data: { id, name: `Nhân viên ${id}` } });
    }
    return api.get(`/api/nhanvien/getByID/${id}`);
  },
  create: (data) => api.post('/api/nhanvien/addnhanvien', data),
  update: (id, data) => api.put(`/api/nhanvien/updatenhanvien/${id}`, data),
  delete: (id) => api.delete(`/api/nhanvien/deleteNhanvien/${id}`),
};

// Department APIs (Phòng ban)
export const departments = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Phòng ban', 4) });
    }
    return api.get('/api/phongban/getAll');
  },
  getById: (id) => api.get(`/api/phongban/getById/${id}`),
  create: (data) => api.post('/api/phongban/addPhongban', data),
  update: (id, data) => api.put(`/api/phongban/updatePhongBan/${id}`, data),
  delete: (id) => api.delete(`/api/phongban/deletePhongBan/${id}`),
};

// Position APIs (Chức vụ)
export const positions = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Chức vụ', 5) });
    }
    return api.get('/api/chucvu/getAll');
  },
  getById: (id) => api.get(`/api/chucvu/getById/${id}`),
  create: (data) => api.post('/api/chucvu/addChucVu', data),
  update: (id, data) => api.put(`/api/chucvu/updateChucVu/${id}`, data),
  delete: (id) => api.delete(`/api/chucvu/deleteChucVu/${id}`),
};

// Division APIs (Bộ phận)
export const divisions = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Bộ phận', 3) });
    }
    return api.get('/api/bophan/getAll');
  },
  getById: (id) => api.get(`/api/bophan/getById/${id}`),
  create: (data) => api.post('/api/bophan/addBoPhan', data),
  update: (id, data) => api.put(`/api/bophan/updateBoPhan/${id}`, data),
  delete: (id) => api.delete(`/api/bophan/deleteBoPhan/${id}`),
};

// Contract APIs (Hợp đồng)
export const contracts = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Hợp đồng', 10) });
    }
    return api.get('/api/hopdong/getAll');
  },
  getById: (id) => api.get(`/api/hopdong/getById/${id}`),
  create: (data) => api.post('/api/hopdong/addHopDong', data),
  update: (id, data) => api.put(`/api/hopdong/updateHopDong/${id}`, data),
  delete: (id) => api.delete(`/api/hopdong/deleteHopDong/${id}`),
};

// Insurance APIs (Bảo hiểm)
export const insurance = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Bảo hiểm', 8) });
    }
    return api.get('/api/baohiem/getAll');
  },
  getById: (id) => api.get(`/api/baohiem/getById/${id}`),
  create: (data) => api.post('/api/baohiem/addBaoHiem', data),
  update: (id, data) => api.put(`/api/baohiem/updateBaoHiem/${id}`, data),
  delete: (id) => api.delete(`/api/baohiem/deleteBaoHiem/${id}`),
};

// Qualification APIs (Trình độ)
export const qualifications = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Trình độ', 6) });
    }
    return api.get('/api/trinhdo/getAll');
  },
  getById: (id) => api.get(`/api/trinhdo/getById/${id}`),
  create: (data) => api.post('/api/trinhdo/addTrinhDo', data),
  update: (id, data) => api.put(`/api/trinhdo/updateTrinhDo/${id}`, data),
  delete: (id) => api.delete(`/api/trinhdo/deleteTrinhDo/${id}`),
};

// Attendance APIs (Chấm công)
export const attendance = {
  getAll: () => {
    if (isServerDown) {
      return Promise.resolve({ data: createMockData('Chấm công', 20) });
    }
    return api.get('/api/chamcong/getAll');
  },
};

export default api; 