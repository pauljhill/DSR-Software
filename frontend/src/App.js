import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AlertMessage from './components/common/AlertMessage';
import LoadingOverlay from './components/common/LoadingOverlay';

// Pages
import ShowList from './pages/ShowList';
import ShowDetail from './pages/ShowDetail';
import ShowForm from './pages/ShowForm';
import EquipmentList from './pages/EquipmentList';
import EquipmentDetail from './pages/EquipmentDetail';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import CsvViewer from './pages/CsvViewer';

// Hooks & Services
import { useAuth } from './hooks/useAuth';
import { useAlert } from './hooks/useAlert';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
    secondary: {
      main: '#FF6600',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loading: authLoading, login, logout } = useAuth();
  const { alert, showAlert, hideAlert } = useAlert();
  const [globalLoading, setGlobalLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (authLoading) return <LoadingOverlay />;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  // Admin route component
  const AdminRoute = ({ children }) => {
    if (authLoading) return <LoadingOverlay />;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/" />;
    return children;
  };

  // LSO route component
  const LsoRoute = ({ children }) => {
    if (authLoading) return <LoadingOverlay />;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'lso' && user.role !== 'admin') return <Navigate to="/" />;
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {user && <Header toggleSidebar={toggleSidebar} user={user} onLogout={logout} />}
          
          <Box sx={{ display: 'flex', flex: 1 }}>
            {user && <Sidebar open={sidebarOpen} />}
            
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
                ml: { sm: sidebarOpen ? '240px' : 0 },
                transition: theme.transitions.create(['margin', 'width'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              {/* Global loading overlay */}
              {globalLoading && <LoadingOverlay />}
              
              {/* Global alert */}
              <AlertMessage
                open={alert.show}
                message={alert.message}
                severity={alert.severity}
                onClose={hideAlert}
              />
              
              <Routes>
                <Route path="/login" element={<Login onLogin={login} />} />
                
                <Route path="/" element={<ProtectedRoute><ShowList /></ProtectedRoute>} />
                
                <Route path="/shows" element={<ProtectedRoute><ShowList /></ProtectedRoute>} />
                
                <Route path="/shows/:id" element={<ProtectedRoute><ShowDetail /></ProtectedRoute>} />
                
                <Route path="/shows/new" element={<LsoRoute><ShowForm /></LsoRoute>} />
                
                <Route path="/shows/edit/:id" element={<LsoRoute><ShowForm /></LsoRoute>} />
                
                <Route path="/equipment" element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
                
                <Route path="/equipment/:id" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
                
                <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                
                <Route path="/csv/:type" element={<ProtectedRoute><CsvViewer /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Box>
          
          {user && <Footer />}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
