import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px',
      backgroundColor: '#2c3e50',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/images/raylx-logo.svg" 
          alt="RayLX Logo" 
          style={{ height: '40px', marginRight: '10px' }} 
        />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            DSR Management System
          </Link>
        </h1>
      </div>
      
      <div>
        <span style={{ marginRight: '15px' }}>User: Admin</span>
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;