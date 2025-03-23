/**
 * EquipmentSelector component for selecting equipment
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * EquipmentSelector component for selecting equipment
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const EquipmentSelector = ({
  equipment,
  loading,
  error,
  onAddEquipment,
  title = 'Add Equipment'
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Handle equipment selection
  const handleSelectEquipment = (event, value) => {
    setSelectedEquipment(value);
  };
  
  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };
  
  // Handle adding equipment
  const handleAddEquipment = () => {
    if (selectedEquipment) {
      onAddEquipment(selectedEquipment, quantity);
      // Reset after adding
      setSelectedEquipment(null);
      setQuantity(1);
    }
  };
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
      {title && (
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Autocomplete
          id="equipment-selector"
          options={equipment || []}
          getOptionLabel={(option) => `${option.brand} ${option.model}`}
          value={selectedEquipment}
          onChange={handleSelectEquipment}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Equipment"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="body1">
                  {option.brand} {option.model}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.type} - Power: {option.power_output || 'N/A'}
                </Typography>
              </Box>
            </li>
          )}
          disabled={loading || !!error}
        />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            InputProps={{
              inputProps: { min: 1 },
              startAdornment: <InputAdornment position="start">×</InputAdornment>,
            }}
            sx={{ width: 120 }}
            disabled={!selectedEquipment}
          />
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEquipment}
            disabled={!selectedEquipment}
          >
            Add
          </Button>
        </Box>
      </Box>
      
      {selectedEquipment && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
            <strong>Selected:</strong> {selectedEquipment.brand} {selectedEquipment.model}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedEquipment.type} - Power: {selectedEquipment.power_output || 'N/A'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

EquipmentSelector.propTypes = {
  equipment: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAddEquipment: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default EquipmentSelector;