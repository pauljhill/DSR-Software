import React, { useState, useEffect } from 'react';

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    brand: '',
    model: '',
    type: '',
    power: '',
    nohd: '',
    wavelength: ''
  });

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, using example data
    setTimeout(() => {
      const exampleEquipment = [
        { id: 'EQ001', brand: 'ClubMax', model: '1800 RGB', type: 'Laser', power: '1800mW', nohd: '3m', wavelength: '638nm, 520nm, 450nm' },
        { id: 'EQ002', brand: 'ClubMax', model: '3000 RGB', type: 'Laser', power: '3000mW', nohd: '3.8m', wavelength: '638nm, 520nm, 450nm' },
        { id: 'EQ003', brand: 'Atom', model: '9000 RGB', type: 'Laser', power: '9000mW', nohd: '5.2m', wavelength: '638nm, 520nm, 450nm' },
        { id: 'EQ004', brand: 'DS', model: '2000 RGB', type: 'Laser', power: '2000mW', nohd: '3.2m', wavelength: '638nm, 520nm, 450nm' }
      ];
      setEquipment(exampleEquipment);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    // In a real app, this would send to the API
    const newItem = {
      id: `EQ${equipment.length + 1}`.padStart(5, '0'),
      ...newEquipment
    };
    setEquipment(prev => [...prev, newItem]);
    setNewEquipment({
      brand: '',
      model: '',
      type: '',
      power: '',
      nohd: '',
      wavelength: ''
    });
    setShowAddForm(false);
  };

  if (loading) return <div>Loading equipment...</div>;
  if (error) return <div>Error loading equipment: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Equipment Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {showAddForm ? 'Cancel' : 'Add New Equipment'}
        </button>
      </div>
      
      {showAddForm && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>Add New Equipment</h3>
          <form onSubmit={handleAddEquipment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Brand</label>
              <input 
                type="text"
                name="brand"
                value={newEquipment.brand}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Model</label>
              <input 
                type="text"
                name="model"
                value={newEquipment.model}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Type</label>
              <input 
                type="text"
                name="type"
                value={newEquipment.type}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Power</label>
              <input 
                type="text"
                name="power"
                value={newEquipment.power}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>NOHD</label>
              <input 
                type="text"
                name="nohd"
                value={newEquipment.nohd}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Wavelength</label>
              <input 
                type="text"
                name="wavelength"
                value={newEquipment.wavelength}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
              <button 
                type="submit"
                style={{
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add Equipment
              </button>
            </div>
          </form>
        </div>
      )}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Brand</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Model</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Power</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>NOHD</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Wavelength</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.brand}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.model}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.type}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.power}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.nohd}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.wavelength}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginRight: '10px' }}>
                  Edit
                </button>
                <button style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentManagement;