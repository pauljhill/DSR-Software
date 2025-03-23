import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { formatDateForAPI } from '../utils/dateUtils';

/**
 * A wrapper for date input that handles DD/MM/YYYY format consistently
 * using a simple text field for manual entry
 */
const DatePickerWrapper = ({ value, onChange, label, required, disabled, helperText, ...props }) => {
  // Local state for the input field value
  const [inputValue, setInputValue] = useState('');
  
  // Update local state when prop value changes
  useEffect(() => {
    if (value) {
      const formattedValue = typeof value === 'string' ? value : formatDateForAPI(value);
      setInputValue(formattedValue);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (event) => {
    // Update local input value without validation while typing
    setInputValue(event.target.value);
  };
  
  const handleBlur = () => {
    // If empty, clear the date
    if (!inputValue || inputValue === '') {
      onChange(null);
      return;
    }
    
    // Skip validation if the format is already correct
    if (inputValue.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // Pass the string directly as DD/MM/YYYY
      onChange(inputValue);
      return;
    }
    
    // Try to parse other formats
    try {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        // Format the date to DD/MM/YYYY string
        const formattedDate = formatDateForAPI(date);
        setInputValue(formattedDate);
        // Pass the string directly
        onChange(formattedDate);
      }
    } catch (e) {
      console.log('Could not parse date:', inputValue);
    }
  };

  return (
    <TextField
      label={label}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      required={required}
      helperText={helperText || "Enter date in DD/MM/YYYY format"}
      fullWidth
      placeholder="DD/MM/YYYY"
      {...props}
    />
  );
};

// Add PropTypes validation for all the props
DatePickerWrapper.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string
};

// Add default props
DatePickerWrapper.defaultProps = {
  value: null,
  label: '',
  required: false,
  disabled: false,
  helperText: ''
};

export default DatePickerWrapper;