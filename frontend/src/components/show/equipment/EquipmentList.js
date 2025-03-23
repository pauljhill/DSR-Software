/**
 * EquipmentList component for displaying selected equipment
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Tooltip,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

/**
 * EquipmentList component for displaying selected equipment
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const EquipmentList = ({
  selectedEquipment,
  onUpdateQuantity,
  onRemoveEquipment,
  onViewDetails,
  title = 'Selected Equipment',
  emptyMessage = 'No equipment selected'
}) => {
  // Handle quantity change
  const handleQuantityChange = (equipmentId, event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      onUpdateQuantity(equipmentId, value);
    }
  };
  
  // Calculate total power
  const totalPower = selectedEquipment.reduce((total, item) => {
    const power = parseFloat(item.power_output) || 0;
    return total + (power * item.quantity);
  }, 0);
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">
          {title}
        </Typography>
        
        {selectedEquipment.length > 0 && (
          <Chip 
            label={`Total items: ${selectedEquipment.reduce((acc, item) => acc + item.quantity, 0)}`} 
            color="primary" 
            size="small" 
          />
        )}
      </Box>
      
      {totalPower > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total Power: {totalPower.toFixed(2)} W
        </Typography>
      )}
      
      {selectedEquipment.length > 0 ? (
        <List>
          {selectedEquipment.map((item, index) => (
            <React.Fragment key={item.id || index}>
              {index > 0 && <Divider component="li" />}
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.brand} {item.model}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.type || 'Laser System'}
                      </Typography>
                      {item.power_output && (
                        <Typography variant="body2" color="text.secondary">
                          Power: {item.power_output} W × {item.quantity} = {(parseFloat(item.power_output) * item.quantity).toFixed(2)} W
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                    InputProps={{
                      inputProps: { min: 1, style: { textAlign: 'center' } },
                    }}
                    sx={{ width: 70, mr: 1 }}
                  />
                  <Tooltip title="View Details">
                    <IconButton 
                      edge="end" 
                      aria-label="details"
                      onClick={() => onViewDetails(item)}
                      size="small"
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => onRemoveEquipment(item.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Alert severity="info" sx={{ mt: 1 }}>
          {emptyMessage}
        </Alert>
      )}
    </Paper>
  );
};

EquipmentList.propTypes = {
  selectedEquipment: PropTypes.array.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveEquipment: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  title: PropTypes.string,
  emptyMessage: PropTypes.string
};

export default EquipmentList;