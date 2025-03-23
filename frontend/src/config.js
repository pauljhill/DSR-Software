// Determine the backend URL based on the current hostname
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  
  // If we're on localhost, use localhost for the backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Otherwise, use the same hostname but with port 3001
  return `http://${hostname}:3001`;
};

export const BACKEND_URL = getBackendUrl(); 