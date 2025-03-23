import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShowsManagement = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, using example data
    setTimeout(() => {
      const exampleShows = [
        { id: 'SH001', name: 'Base Makes the Face', date: '2024-03-15', status: 'Completed', venue: 'Metropolis Club' },
        { id: 'SH002', name: 'Laser Symphony', date: '2024-04-01', status: 'Planned', venue: 'Grand Theater' },
        { id: 'SH003', name: 'Neon Nights', date: '2024-03-28', status: 'In Progress', venue: 'Electric Arena' },
        { id: 'SH004', name: 'Light Up 2024', date: '2024-05-10', status: 'Planned', venue: 'Stadium XL' }
      ];
      setShows(exampleShows);
      setLoading(false);
    }, 1000);
  }, []);

  const generatePDF = async (showId) => {
    alert(`Generate PDF for show ${showId} - In a real app, this would call the API`);
  };

  if (loading) return <div>Loading shows...</div>;
  if (error) return <div>Error loading shows: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Shows Management</h2>
        <Link to="/shows/new" style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          Add New Show
        </Link>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Venue</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(show => (
            <tr key={show.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{show.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{show.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{show.date}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{show.venue}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <span style={{
                  backgroundColor: show.status === 'Completed' ? '#e0f2f1' : 
                                   show.status === 'In Progress' ? '#fff8e1' : '#e8f5e9',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85em'
                }}>
                  {show.status}
                </span>
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/shows/${show.id}`} style={{ color: '#3498db' }}>
                    Edit
                  </Link>
                  <button 
                    onClick={() => generatePDF(show.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#e74c3c', 
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Generate PDF
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowsManagement;