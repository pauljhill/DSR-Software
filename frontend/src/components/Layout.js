import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  List as ListIcon,
  Build,
  People,
  Science,
  Logout,
  BarChart,
  Storage as StorageIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Shows', icon: <ListIcon />, path: '/shows' },
    { text: 'Equipment', icon: <Build />, path: '/equipment' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Testing', icon: <Science />, path: '/show-editor-testing' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  const handleBackup = async () => {
    try {
      // Show a confirmation dialog
      if (!window.confirm('Create a backup of all DSR data to the home directory?')) {
        return;
      }
      
      // Call the backend API to trigger the backup script
      const response = await fetch('http://localhost:3001/api/backup', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Backup failed: ${await response.text()}`);
      }
      
      const result = await response.json();
      alert(`Backup completed successfully!\nSaved to: ${result.backupPath}\nSize: ${result.size}`);
    } catch (error) {
      console.error('Error creating backup:', error);
      alert(`Error creating backup: ${error.message}`);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.2rem',
        }}>
          RayLx
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: 'primary.light' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'RayLx'}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleBackup} 
            startIcon={<BackupIcon />}
            sx={{ mr: 2 }}
          >
            Backup
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}