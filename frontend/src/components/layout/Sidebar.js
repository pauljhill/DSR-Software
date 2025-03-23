import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <nav style={{
      width: '200px',
      backgroundColor: '#f5f5f5',
      padding: '20px 0',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Link
              to={item.path}
              style={{
                display: 'block',
                padding: '10px 20px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#3498db' : '#333',
                backgroundColor: location.pathname === item.path ? '#e6f0f7' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #3498db' : '4px solid transparent',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;