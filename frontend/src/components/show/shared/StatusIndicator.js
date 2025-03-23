/**
 * StatusIndicator component for displaying show status
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Chip, Tooltip, Box, Typography } from '@mui/material';

// Status color mapping
const STATUS_COLORS = {
  'Planning': 'default',
  'Preshow Done': 'info',
  'Setup Done': 'warning',
  'Completed': 'success',
  'Canceled': 'error',
  'Void': 'error'
};

// Status descriptions
const STATUS_DESCRIPTIONS = {
  'Planning': 'Initial planning phase - core show details need to be completed',
  'Preshow Done': 'Preshow tasks completed - equipment selected, risk assessment done',
  'Setup Done': 'Setup completed - lasers mounted, beam paths verified, verification photos uploaded',
  'Completed': 'Show completed - all setup and post-show details filled in',
  'Canceled': 'Show canceled - no further action required',
  'Void': 'Show voided - permanently removed from active shows'
};

/**
 * StatusIndicator component for displaying show status
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const StatusIndicator = ({
  status,
  showLabel = true,
  showDescription = false,
  size = 'medium'
}) => {
  const color = STATUS_COLORS[status] || 'default';
  const description = STATUS_DESCRIPTIONS[status] || 'Status unknown';
  
  return (
    <Box>
      <Tooltip title={description} arrow>
        <Chip
          label={status}
          color={color}
          size={size}
          variant="filled"
        />
      </Tooltip>
      
      {showLabel && (
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Status
        </Typography>
      )}
      
      {showDescription && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  showDescription: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium'])
};

export default StatusIndicator;