import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/shows');
        setShows(response.data);
        setFilteredShows(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shows:', err);
        setError('Failed to load shows. Please try again later.');
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShows(shows);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = shows.filter(show => 
        show.show_id.toLowerCase().includes(term) || 
        show.show_name.toLowerCase().includes(term) ||
        (show.client_name && show.client_name.toLowerCase().includes(term))
      );
      setFilteredShows(filtered);
    }
  }, [searchTerm, shows]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusChip = (date, needsUpdate) => {
    const showDate = new Date(date);
    const today = new Date();
    const pastDue = showDate < today;
    
    if (needsUpdate === 'true') {
      return <Chip label="Needs Update" color="warning" size="small" />
    } else if (pastDue) {
      return <Chip label="Past" color="default" size="small" />
    } else {
      return <Chip label="Upcoming" color="success" size="small" />
    }
  };

  const handleGeneratePDF = async (showId) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/pdf/generate/${showId}`);
      console.log('PDF generated:', response.data);
      
      // Refresh the show list to update the PDF status
      const updatedShows = await axios.get('http://localhost:3001/api/shows');
      setShows(updatedShows.data);
      setFilteredShows(updatedShows.data.filter(show => 
        show.show_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        show.show_name.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      // Redirect to PDF viewer
      window.open(`/pdf/${showId}`, '_blank');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Show Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/shows/create"
        >
          New Show
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search shows by ID, name or client..."
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShows.length > 0 ? (
              filteredShows.map((show) => (
                <TableRow key={show.show_id}>
                  <TableCell>{show.show_id}</TableCell>
                  <TableCell>{show.show_name}</TableCell>
                  <TableCell>{formatDate(show.show_date)}</TableCell>
                  <TableCell>{show.client_name}</TableCell>
                  <TableCell>{getStatusChip(show.show_date, show.needs_update)}</TableCell>
                  <TableCell>
                    <IconButton 
                      component={Link} 
                      to={`/shows/${show.show_id}`}
                      title="View Show"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      component={Link} 
                      to={`/shows/${show.show_id}/edit`}
                      title="Edit Show"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleGeneratePDF(show.show_id)}
                      title="Generate PDF"
                      color={show.has_generated_pdf === 'true' ? 'success' : 'default'}
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {searchTerm ? 'No shows found matching your search' : 'No shows available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ShowList;
