import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/equipment');
        setEquipment(response.data);
        setFilteredEquipment(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching equipment:', err);
        setError('Failed to load equipment data. Please try again later.');
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEquipment(equipment);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = equipment.filter(item => 
        item.brand.toLowerCase().includes(term) || 
        item.model.toLowerCase().includes(term) ||
        (item.type && item.type.toLowerCase().includes(term))
      );
      setFilteredEquipment(filtered);
    }
  }, [searchTerm, equipment]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getEquipmentTypeChip = (type) => {
    let color = 'default';
    
    if (type === 'Laser') {
      color = 'error';
    } else if (type === 'Laser Control System' || type === 'Laser Software') {
      color = 'info';
    } else if (type === 'Safety Equipment') {
      color = 'success';
    }
    
    return <Chip label={type} color={color} size="small" />
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Equipment Database
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by brand, model, or type..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Power</TableCell>
              <TableCell>Wavelengths</TableCell>
              <TableCell>NOHD</TableCell>
              <TableCell>Divergence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((item) => (
                <TableRow key={item.item_id}>
                  <TableCell><strong>{item.brand}</strong></TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>{getEquipmentTypeChip(item.type)}</TableCell>
                  <TableCell>{item.power || 'N/A'}</TableCell>
                  <TableCell>{item.wavelengths || 'N/A'}</TableCell>
                  <TableCell>{item.nohd || 'N/A'}</TableCell>
                  <TableCell>{item.divergence || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm ? 'No equipment found matching your search' : 'No equipment data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EquipmentList;
