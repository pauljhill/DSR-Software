/**
 * CrewManager component for handling LSO crew selection
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import CsvService from '../../../services/csvService';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Create a service instance
const csvService = new CsvService();

/**
 * CrewManager component for handling LSO crew selection
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const CrewManager = ({
  selectedCrew,
  onChange,
  title = 'Laser Safety Officers (LSO)',
  maxSelections = 5,
  crewType = 'LSO',
  directSelect = false,
  saveCrew
}) => {
  const [crews, setCrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrewMember, setSelectedCrewMember] = useState(null);
  const [internalSelectedCrew, setInternalSelectedCrew] = useState([]);
  
  // Process selectedCrew to ensure proper format for internal use
  useEffect(() => {
    // Convert string to array for internal use
    if (typeof selectedCrew === 'string') {
      if (selectedCrew.trim() === '') {
        setInternalSelectedCrew([]);
      } else {
        const crewNames = selectedCrew.split(';').map(name => name.trim()).filter(name => name);
        // Convert to array of objects with name property
        const crewArray = crewNames.map(name => ({ 
          id: name, // Use name as ID for now
          name: name,
          full_name: name 
        }));
        setInternalSelectedCrew(crewArray);
      }
    } else if (Array.isArray(selectedCrew)) {
      setInternalSelectedCrew(selectedCrew);
    } else {
      setInternalSelectedCrew([]);
    }
  }, [selectedCrew]);
  
  // Load crew list from CSV
  useEffect(() => {
    const loadCrews = async () => {
      try {
        setLoading(true);
        // Load from users.csv instead of crew.csv
        const data = await csvService.getAll('users.csv');
        // Filter based on crewType
        let filteredUsers = [];
        
        if (crewType === 'LSO') {
          // Filter for users with LSO role
          const today = new Date();
          filteredUsers = data ? data.filter(user => {
            // Check if user has LSO role
            const hasLsoRole = user.role === 'LSO' || user.role === 'ADMIN-LSO';
            
            // Check if training date is valid
            let hasValidTraining = false;
            if (user.lso_training_renew_date) {
              // Parse the date (assuming format dd/mm/yyyy)
              const parts = user.lso_training_renew_date.split('/');
              if (parts.length === 3) {
                const renewDate = new Date(parts[2], parts[1] - 1, parts[0]); // year, month (0-indexed), day
                hasValidTraining = renewDate >= today;
              }
            }
            
            return hasLsoRole && hasValidTraining;
          }) : [];
        } else if (crewType === 'CREW') {
          // Filter for users with CREW role, LSO roles, but not OTHER
          filteredUsers = data ? data.filter(user => 
            user.role === 'CREW' || user.role === 'LSO' || user.role === 'ADMIN-LSO'
          ) : [];
        } else if (crewType === 'ALL') {
          // All users regardless of role
          filteredUsers = data || [];
        } else {
          // No filtering
          filteredUsers = data || [];
        }
        
        setCrews(filteredUsers);
        setError(null);
      } catch (error) {
        console.error('Error loading crew data:', error);
        setError('Failed to load crew list');
      } finally {
        setLoading(false);
      }
    };
    
    loadCrews();
  }, [crewType]);
  
  // Handle crew member selection
  const handleCrewSelect = (event, value) => {
    if (directSelect) {
      // For direct select (LSO), return the full object with name, email and contact_number
      console.log('LSO selection in CrewManager:', value);
      const displayName = value ? getCrewDisplayName(value) : '';
      setInternalSelectedCrew(value ? [value] : []);
      // Pass the full user object to onChange, with forceSave flag
      onChange(value, { forceSave: true });
    } else {
      // For normal mode (general crew), just track selection for Add button
      setSelectedCrewMember(value);
    }
  };
  
  // Add selected crew member to the list
  const handleAddCrewMember = () => {
    if (!selectedCrewMember) return;
    
    // Get the display name
    const displayName = getCrewDisplayName(selectedCrewMember);
    
    // Prevent duplicates - check in the internal array
    if (internalSelectedCrew.some(crew => 
      typeof crew === 'object' ? crew.id === selectedCrewMember.id : crew === displayName
    )) {
      setSelectedCrewMember(null);
      return;
    }
    
    // Check maximum selections
    if (internalSelectedCrew.length >= maxSelections) {
      return;
    }
    
    // Add to internal array
    const updatedCrew = [...internalSelectedCrew, selectedCrewMember];
    setInternalSelectedCrew(updatedCrew);
    
    // Format for output based on what the parent expects
    const crewNames = updatedCrew.map(crew => getCrewDisplayName(crew));
    onChange(crewNames.join('; '));
    
    // Direct save - hardcoded solution
    if (saveCrew) {
      console.log("DIRECTLY saving after crew add");
      setTimeout(() => saveCrew(), 10);
    }
    
    // Reset selection
    setSelectedCrewMember(null);
  };
  
  // Remove crew member from selection
  const handleRemoveCrewMember = (crewId) => {
    // Remove from internal array
    const updatedCrew = internalSelectedCrew.filter(crew => 
      typeof crew === 'object' ? crew.id !== crewId : crew !== crewId
    );
    setInternalSelectedCrew(updatedCrew);
    
    // Update parent with formatted string
    const crewNames = updatedCrew.map(crew => 
      typeof crew === 'object' ? getCrewDisplayName(crew) : crew
    );
    onChange(crewNames.join('; '));
    
    // Direct save - hardcoded solution
    if (saveCrew) {
      console.log("DIRECTLY saving after crew remove");
      setTimeout(() => saveCrew(), 10);
    }
  };
  
  // Get displayed name of crew member
  const getCrewDisplayName = (crew) => {
    if (!crew) return '';
    if (typeof crew === 'string') return crew;
    // Map the fields from users.csv format to what we expect
    return crew.full_name || `${crew.first_name || ''} ${crew.last_name || ''}`.trim();
  };
  
  // Custom isOptionEqualToValue function for Autocomplete
  const isOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;
    
    if (typeof value === 'string') {
      return getCrewDisplayName(option) === value;
    }
    
    return option.id === value.id || 
           getCrewDisplayName(option) === getCrewDisplayName(value);
  };
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Autocomplete
          id="crew-selector"
          options={crews}
          getOptionLabel={getCrewDisplayName}
          value={directSelect ? (internalSelectedCrew.length > 0 ? internalSelectedCrew[0] : null) : selectedCrewMember}
          onChange={handleCrewSelect}
          isOptionEqualToValue={isOptionEqualToValue}
          sx={{ flexGrow: 1, mr: directSelect ? 0 : 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={`Select ${crewType}`}
              placeholder={`Search for ${crewType}`}
              fullWidth
              error={!!error}
              helperText={error}
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
                  {getCrewDisplayName(option)}
                </Typography>
                {option.email && (
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                )}
              </Box>
            </li>
          )}
          disabled={loading}
        />
        
        {!directSelect && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddCrewMember}
            disabled={!selectedCrewMember || internalSelectedCrew.length >= maxSelections}
            size="medium"
          >
            Add
          </Button>
        )}
      </Box>
      
      {!directSelect && internalSelectedCrew.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, p: 0 }}>
          <List dense>
            {internalSelectedCrew.map((crew, index) => {
              const crewId = typeof crew === 'object' ? crew.id : crew;
              const displayName = getCrewDisplayName(crew);
              
              return (
                <React.Fragment key={crewId || index}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={displayName}
                      secondary={typeof crew === 'object' ? crew.email : null}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleRemoveCrewMember(crewId)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
      
      {maxSelections > 0 && internalSelectedCrew.length >= maxSelections && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          Maximum of {maxSelections} {crewType} can be selected
        </Typography>
      )}
    </Paper>
  );
};

CrewManager.propTypes = {
  selectedCrew: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  maxSelections: PropTypes.number,
  crewType: PropTypes.string,
  directSelect: PropTypes.bool,
  saveCrew: PropTypes.func
};

export default CrewManager;