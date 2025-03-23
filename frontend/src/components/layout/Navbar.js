import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar({ toggleSidebar }) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={toggleSidebar}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          DSR System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
};

export default Navbar;