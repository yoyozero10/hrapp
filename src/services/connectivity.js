import api, { checkServerStatus } from './api';

/**
 * Utility to check if we have internet connectivity 
 * (even if the server is down)
 */
export const checkInternetConnectivity = async () => {
  // Instead of trying to directly fetch Google (which causes CORS issues),
  // we'll assume internet is available and focus on API server connectivity
  // If we can't reach our API, it could be either internet issues or server issues
  return true;
};

/**
 * Comprehensive connection test that checks both internet
 * and API server connectivity
 */
export const runConnectionDiagnostics = async () => {
  const results = {
    internetConnected: true, // Assume internet is available
    serverConnected: false,
    serverStatus: null,
    errors: []
  };
  
  // Skip the internet connectivity check due to CORS issues
  // and go straight to checking API server connectivity
  
  try {
    // Test the server with a lightweight endpoint
    await api.get('/api/nhanvien/getAll', { 
      timeout: 5000,
      // Prevent retries for this specific diagnostic request
      maxRetries: 0
    });
    
    results.serverConnected = true;
    results.serverStatus = 'ONLINE';
  } catch (error) {
    results.serverConnected = false;
    
    // Determine specific server status
    if (error.code === 'ECONNABORTED') {
      results.serverStatus = 'TIMEOUT';
      results.errors.push('Server connection timed out');
    } else if (error.response) {
      // We got a response, but it's an error status code
      results.serverStatus = 'ERROR';
      results.serverConnected = true; // Server is online but returning errors
      results.errors.push(`Server responded with status: ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response
      results.serverStatus = 'NO_RESPONSE';
      results.errors.push('Server did not respond to request');
    } else {
      // Something else went wrong
      results.serverStatus = 'UNKNOWN_ERROR';
      results.errors.push(`Connection error: ${error.message}`);
    }
    
    // Update the global server status
    const { setServerDown } = checkServerStatus();
    setServerDown(true);
  }
  
  return results;
};

/**
 * Get a user-friendly message based on diagnostic results
 */
export const getConnectionStatusMessage = (diagnostics) => {
  if (!diagnostics.serverConnected) {
    switch (diagnostics.serverStatus) {
      case 'TIMEOUT':
        return 'Kết nối đến máy chủ quá chậm. Máy chủ có thể đang bận hoặc đang khởi động.';
      case 'NO_RESPONSE':
        return 'Máy chủ không phản hồi. Có thể máy chủ đang ngủ hoặc không hoạt động.';
      case 'UNREACHABLE':
        return 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.';
      default:
        return 'Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.';
    }
  }
  
  if (diagnostics.serverStatus === 'ERROR') {
    return 'Máy chủ đang hoạt động nhưng trả về lỗi. Vui lòng thông báo cho quản trị viên.';
  }
  
  return 'Kết nối đến máy chủ thành công.';
}; 