import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const PDFViewer = () => {
  const { showId } = useParams();
  const [pdfUrl, setPdfUrl] = useState('');
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get show details
        const showResponse = await axios.get(`http://localhost:3001/api/shows/${showId}`);
        setShowDetails(showResponse.data);
        
        // Get show's files to find the PDF
        const filesResponse = await axios.get(`http://localhost:3001/api/shows/${showId}/files`);
        
        // Look for the DSR PDF file
        const pdfFile = filesResponse.data.find(file => file.name === 'dsr.pdf');
        
        if (pdfFile) {
          setPdfUrl(`http://localhost:3001${pdfFile.path}`);
        } else {
          // If no PDF found, try to generate one
          const generateResponse = await axios.post(`http://localhost:3001/api/pdf/generate/${showId}`);
          if (generateResponse.data.success) {
            setPdfUrl(`http://localhost:3001${generateResponse.data.pdfPath}`);
          } else {
            throw new Error('Failed to generate PDF');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err.message || 'Failed to load or generate PDF');
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body1">Loading PDF...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          component={Link}
          to={`/shows/${showId}`}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Show
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            component={Link}
            to={`/shows/${showId}`}
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Show
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            Open in New Tab
          </Button>
        </Box>
        <Typography variant="h6">
          {showDetails?.show_name} - DSR Document
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          <strong>Show ID:</strong> {showDetails?.show_id}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {new Date(showDetails?.show_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Client:</strong> {showDetails?.client_name}
        </Typography>
      </Paper>

      <Box
        sx={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <iframe
          src={pdfUrl}
          title="DSR Document"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </Box>
    </Box>
  );
};

export default PDFViewer;
