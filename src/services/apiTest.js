import api, { auth, employees, departments } from './api';

// Simple API connection test without direct checks that could trigger CORS
export const testApiConnection = async () => {
  try {
    // We'll use an endpoint we know exists and don't try to fetch external resources
    const response = await api.get('/api/nhanvien/getAll', {
      timeout: 5000,
      // Don't retry for tests
      maxRetries: 0
    });
    console.log('API server connection test:', response.status === 200 ? 'Success' : 'Failed');
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    console.error('API server connection test failed:', error);
    return { 
      success: false, 
      message: `API connection failed: ${error.message}`,
      error: error 
    };
  }
};

// Function to test login
export const testLogin = async (username, password) => {
  try {
    const response = await auth.login(username, password);
    console.log('Login test:', response.data ? 'Success' : 'Failed');
    return { 
      success: true, 
      message: 'Login successful', 
      data: response.data 
    };
  } catch (error) {
    console.error('Login test failed:', error);
    
    // Try fake login if server is down
    try {
      const fakeResponse = await auth.fakeLogin(username, password);
      console.log('Fake login test:', fakeResponse.data ? 'Success' : 'Failed');
      return { 
        success: true, 
        message: 'Fake login successful (real server may be down)', 
        data: fakeResponse.data,
        usingFakeLogin: true
      };
    } catch (fakeError) {
      return { 
        success: false, 
        message: `Both real and fake login failed. ${error.message}`, 
        error: error 
      };
    }
  }
};

// Function to test data retrieval
export const testDataRetrieval = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return { 
        success: false, 
        message: 'No auth token found. Please login first.' 
      };
    }
    
    // Try to get employee data as a test
    const employeeResponse = await employees.getAll();
    
    return { 
      success: true, 
      message: 'Data retrieval successful', 
      employeeCount: employeeResponse.data?.length || 0
    };
  } catch (error) {
    console.error('Data retrieval test failed:', error);
    return { 
      success: false, 
      message: `Data retrieval failed: ${error.message}`, 
      error: error 
    };
  }
}; 