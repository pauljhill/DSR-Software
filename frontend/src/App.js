// App.js - Ready for rebuild 
import React, { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Lazy load pages
const ShowsManagement = React.lazy(() => import('./pages/ShowsManagement'));
const ShowEdit = React.lazy(() => import('./pages/ShowEdit'));
const EquipmentManagement = React.lazy(() => import('./pages/EquipmentManagement'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const DataView = React.lazy(() => import('./pages/DataView'));

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Create a dark theme with purple accents
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#ce93d8', // Light purple
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
        },
      },
    },
  },
});

// Navigation items
const navItems = [
  { title: 'Shows', path: '/shows' },
  { title: 'Equipment', path: '/equipment' },
  { title: 'Users', path: '/users' },
  { title: 'Data Viewer', path: '/data-view' },
];

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="fixed">
          <Toolbar>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src="/raylx-logo.png" 
                alt="RayLX Logo" 
                style={{ 
                  height: '40px', 
                  marginRight: theme.spacing(2),
                  display: isMobile ? 'none' : 'block'
                }} 
              />
              <Typography variant="h6" component="div">
                RayLX
              </Typography>
            </Box>

            {/* Navigation */}
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem 
                      key={item.path}
                      onClick={() => {
                        handleClose();
                        window.location.href = item.path;
                      }}
                    >
                      {item.title}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Typography
                    key={item.path}
                    variant="button"
                    component="a"
                    href={item.path}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  >
                    {item.title}
                  </Typography>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Content with Suspense */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Export lazy-loaded components
App.ShowsManagement = ShowsManagement;
App.ShowEdit = ShowEdit;
App.EquipmentManagement = EquipmentManagement;
App.UserManagement = UserManagement;
App.DataView = DataView;

export default App; 