/**
 * Application configuration
 */

const config = {
  // API endpoint base URL
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  
  // Application version
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Paths for data files
  paths: {
    shows: '/data/shows.csv',
    equipment: '/data/equipment.csv',
    users: '/data/users.csv'
  }
};

export default config;
