import React from 'react';
import ReactDOM from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './index.css';
import App from './App';

// Providers
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';

// Global error handling
const handleError = (error, errorInfo) => {
  console.error('Global error caught:', error, errorInfo);
  
  // Log to server or service if needed
  // logErrorToService(error, errorInfo);
};

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    handleError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>The application encountered an error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#003366',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Refresh Page
          </button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              overflowX: 'auto'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Initialize the application
const initializeApp = () => {
  // Check for browser compatibility
  const isCompatibleBrowser = () => {
    return (
      typeof window.Promise !== 'undefined' &&
      typeof window.fetch !== 'undefined' &&
      typeof window.Symbol !== 'undefined' &&
      typeof Array.prototype.includes !== 'undefined'
    );
  };

  if (!isCompatibleBrowser()) {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Unsupported Browser</h2>
        <p>Your browser is not supported. Please use a modern browser like Chrome, Firefox, Safari, or Edge.</p>
      </div>
    `;
    return;
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <AlertProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <App />
            </LocalizationProvider>
          </AlertProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Start the application
initializeApp();
