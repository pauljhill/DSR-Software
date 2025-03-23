const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const endpoints = {
  equipment: {
    getAll: () => `${API_URL}/equipment`,
    getById: (id) => `${API_URL}/equipment/${id}`,
    create: () => `${API_URL}/equipment`,
    update: (id) => `${API_URL}/equipment/${id}`,
    delete: (id) => `${API_URL}/equipment/${id}`
  },
  users: {
    getAll: () => `${API_URL}/users`,
    getLSOs: () => `${API_URL}/users/lsos`,
    getCrew: () => `${API_URL}/users/crew`,
    getById: (id) => `${API_URL}/users/${id}`,
    create: () => `${API_URL}/users`,
    update: (id) => `${API_URL}/users/${id}`,
    delete: (id) => `${API_URL}/users/${id}`
  },
  shows: {
    getAll: () => `${API_URL}/shows`,
    getById: (id) => `${API_URL}/shows/${id}`,
    create: () => `${API_URL}/shows`,
    update: (id) => `${API_URL}/shows/${id}`,
    delete: (id) => `${API_URL}/shows/${id}`,
    getFiles: (id) => `${API_URL}/shows/${id}/files`
  },
  uploads: {
    uploadFile: () => `${API_URL}/upload`,
    uploadShowfile: () => `${API_URL}/upload/showfiles` 
  },
  airports: {
    getAll: () => `${API_URL}/airports`,
    getById: (id) => `${API_URL}/airports/${id}`,
    create: () => `${API_URL}/airports`,
    update: (id) => `${API_URL}/airports/${id}`,
    delete: (id) => `${API_URL}/airports/${id}`,
    searchRadius: (lat, lon, radius) => 
      `${API_URL}/airports/search/radius?lat=${lat}&lon=${lon}&radius=${radius}`
  },
  locations: {
    getAll: () => `${API_URL}/locations`,
    getById: (id) => `${API_URL}/locations/${id}`,
    create: (radius) => `${API_URL}/locations${radius ? `?radius=${radius}` : ''}`,
    update: (id, radius) => `${API_URL}/locations/${id}${radius ? `?radius=${radius}` : ''}`,
    delete: (id) => `${API_URL}/locations/${id}`,
    updateAirports: (id, radius) => `${API_URL}/locations/${id}/update-airports?radius=${radius}`
  },
  templates: {
    getAll: () => `${API_URL}/templates`,
    getById: (id) => `${API_URL}/templates/${id}`,
    create: () => `${API_URL}/templates`,
    delete: (id) => `${API_URL}/templates/${id}`
  },
  // TODO: Backend update needed - Implement dedicated CSV endpoints in the backend
  // The following endpoints are defined but not yet implemented in the backend:
  csv: {
    base: `${API_URL}/csv`,
    equipment: {
      get: () => `${API_URL}/csv/equipment`,
      upload: () => `${API_URL}/csv/equipment/upload`
    },
    users: {
      get: () => `${API_URL}/csv/users`,
      upload: () => `${API_URL}/csv/users/upload`
    },
    shows: {
      get: () => `${API_URL}/csv/shows`,
      upload: () => `${API_URL}/csv/shows/upload`
    }
  }
};

export default endpoints; 