import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShows: 0,
    upcomingShows: 0,
    completedShows: 0,
    equipment: 0
  });

  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, using example data
    setStats({
      totalShows: 12,
      upcomingShows: 5,
      completedShows: 7,
      equipment: 24
    });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#f1f8e9',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Total Shows</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalShows}</p>
          <Link to="/shows">View all shows</Link>
        </div>
        
        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Upcoming Shows</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.upcomingShows}</p>
          <Link to="/shows?filter=upcoming">View upcoming shows</Link>
        </div>
        
        <div style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#fff8e1',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Equipment Items</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.equipment}</p>
          <Link to="/equipment">Manage equipment</Link>
        </div>
      </div>
      
      <div>
        <h3>Recent Activity</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            PDF generated for show SH001
            <span style={{ float: 'right', color: '#888' }}>Today</span>
          </li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            Show SH003 status updated to "In Progress"
            <span style={{ float: 'right', color: '#888' }}>Yesterday</span>
          </li>
          <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            New equipment added: ClubMax 3000 RGB
            <span style={{ float: 'right', color: '#888' }}>3 days ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;