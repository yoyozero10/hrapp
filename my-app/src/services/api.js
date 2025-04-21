import axios from 'axios';

const BASE_URL = 'https://doanjava-z61i.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Thêm timeout để tránh request treo vô thời hạn
  timeout: 10000, // 10 giây
  // Cho phép cross-domain cookies
  withCredentials: false,
  // Số lần thử lại request khi gặp lỗi
  maxRetries: 3,
  retryDelay: 1000,
});

// Thêm interceptor để tự động thử lại request khi thất bại
api.interceptors.response.use(null, async (error) => {
  const config = error.config;
  
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
});

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

// Authentication APIs
export const auth = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
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

// Employee APIs (Nhân viên)
export const employees = {
  getAll: () => api.get('/api/nhanvien/getAll'),
  getById: (id) => api.get(`/api/nhanvien/getByID/${id}`),
  create: (data) => api.post('/api/nhanvien/addnhanvien', data),
  update: (id, data) => api.put(`/api/nhanvien/updatenhanvien/${id}`, data),
  delete: (id) => api.delete(`/api/nhanvien/deleteNhanvien/${id}`),
};

// Department APIs (Phòng ban)
export const departments = {
  getAll: () => api.get('/api/phongban/getAll'),
  getById: (id) => api.get(`/api/phongban/getById/${id}`),
  create: (data) => api.post('/api/phongban/addPhongban', data),
  update: (id, data) => api.put(`/api/phongban/updatePhongBan/${id}`, data),
  delete: (id) => api.delete(`/api/phongban/deletePhongBan/${id}`),
};

// Position APIs (Chức vụ)
export const positions = {
  getAll: () => api.get('/api/chucvu/getAll'),
  getById: (id) => api.get(`/api/chucvu/getById/${id}`),
  create: (data) => api.post('/api/chucvu/addChucVu', data),
  update: (id, data) => api.put(`/api/chucvu/updateChucVu/${id}`, data),
  delete: (id) => api.delete(`/api/chucvu/deleteChucVu/${id}`),
};

// Division APIs (Bộ phận)
export const divisions = {
  getAll: () => api.get('/api/bophan/getAll'),
  getById: (id) => api.get(`/api/bophan/getById/${id}`),
  create: (data) => api.post('/api/bophan/addBoPhan', data),
  update: (id, data) => api.put(`/api/bophan/updateBoPhan/${id}`, data),
  delete: (id) => api.delete(`/api/bophan/deleteBoPhan/${id}`),
};

// Contract APIs (Hợp đồng)
export const contracts = {
  getAll: () => api.get('/api/hopdong/getAll'),
  getById: (id) => api.get(`/api/hopdong/getById/${id}`),
  create: (data) => api.post('/api/hopdong/addHopDong', data),
  update: (id, data) => api.put(`/api/hopdong/updateHopDong/${id}`, data),
  delete: (id) => api.delete(`/api/hopdong/deleteHopDong/${id}`),
};

// Insurance APIs (Bảo hiểm)
export const insurance = {
  getAll: () => api.get('/api/baohiem/getAll'),
  getById: (id) => api.get(`/api/baohiem/getById/${id}`),
  create: (data) => api.post('/api/baohiem/addBaoHiem', data),
  update: (id, data) => api.put(`/api/baohiem/updateBaoHiem/${id}`, data),
  delete: (id) => api.delete(`/api/baohiem/deleteBaoHiem/${id}`),
};

// Qualification APIs (Trình độ)
export const qualifications = {
  getAll: () => api.get('/api/trinhdo/getAll'),
  getById: (id) => api.get(`/api/trinhdo/getById/${id}`),
  create: (data) => api.post('/api/trinhdo/addTrinhDo', data),
  update: (id, data) => api.put(`/api/trinhdo/updateTrinhDo/${id}`, data),
  delete: (id) => api.delete(`/api/trinhdo/deleteTrinhDo/${id}`),
};

// Attendance APIs (Chấm công)
export const attendance = {
  getAll: () => api.get('/api/chamcong/getAll'),
};

export default api; 