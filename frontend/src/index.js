import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ErrorBoundary } from './components/ErrorBoundary';

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Lazy-loaded components
const ShowsManagement = React.lazy(() => import('./pages/ShowsManagement'));
const NewShowForm = React.lazy(() => import('./pages/NewShowForm'));
const ShowEdit = React.lazy(() => import('./pages/ShowEdit'));
const EquipmentManagement = React.lazy(() => import('./pages/EquipmentManagement'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const DataView = React.lazy(() => import('./pages/DataView'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    backgroundColor: '#1e1e1e',
    color: '#9c27b0',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.5rem'
  }}>
    <div>
      <div style={{ 
        display: 'inline-block', 
        width: '2rem', 
        height: '2rem',
        borderRadius: '50%',
        borderTop: '3px solid #9c27b0',
        borderRight: '3px solid transparent',
        animation: 'spin 1s linear infinite',
        marginRight: '1rem',
        boxSizing: 'border-box'
      }} />
      Loading...
    </div>
    <style>{
      '@keyframes spin { to { transform: rotate(360deg); } }'
    }</style>
  </div>
);

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#333',
      color: 'white',
      borderRadius: '5px',
      maxWidth: '800px',
      margin: '40px auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: '#ff4444' }}>Something went wrong:</h2>
      <pre style={{ 
        backgroundColor: '#222', 
        padding: '15px', 
        borderRadius: '3px',
        overflow: 'auto',
        maxHeight: '300px'
      }}>
        {error.message}
      </pre>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: '#9c27b0',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Main app rendering
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="dashboard" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <Dashboard />
                  </React.Suspense>
                } 
              />
              <Route 
                path="shows" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <ShowsManagement />
                  </React.Suspense>
                } 
              />
              <Route 
                path="shows/new" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <NewShowForm />
                  </React.Suspense>
                } 
              />
              <Route 
                path="shows/:id" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <ShowEdit />
                  </React.Suspense>
                } 
              />
              <Route 
                path="equipment" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <EquipmentManagement />
                  </React.Suspense>
                } 
              />
              <Route 
                path="users" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <UserManagement />
                  </React.Suspense>
                } 
              />
              <Route 
                path="data-view" 
                element={
                  <React.Suspense fallback={<Loading />}>
                    <DataView />
                  </React.Suspense>
                } 
              />
            </Route>
            <Route 
              path="/login" 
              element={
                <React.Suspense fallback={<Loading />}>
                  <Login />
                </React.Suspense>
              } 
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ErrorBoundary>
  </React.StrictMode>
);