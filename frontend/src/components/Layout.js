import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import Dashboard from '../pages/Dashboard';
import ShowsManagement from '../pages/ShowsManagement';
import ShowEdit from '../pages/ShowEdit';
import EquipmentManagement from '../pages/EquipmentManagement';
import UserManagement from '../pages/UserManagement';

const Layout = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Shows', path: '/shows' },
    { label: 'Equipment', path: '/equipment' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container" style={{ display: 'flex' }}>
        <Sidebar menuItems={menuItems} />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shows" element={<ShowsManagement />} />
            <Route path="/shows/:id" element={<ShowEdit />} />
            <Route path="/equipment" element={<EquipmentManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;