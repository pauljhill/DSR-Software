/**
 * DSR Management System - Backend Server
 */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const pdfService = require('./pdf-service');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving
app.use('/data', express.static(path.join(__dirname, '..', 'data')));

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// PDF generation endpoint
app.post('/api/pdf/generate/:showId', async (req, res) => {
  try {
    const { showId } = req.params;
    
    if (!showId) {
      return res.status(400).json({ success: false, message: 'Show ID is required' });
    }
    
    const pdfPath = await pdfService.generateShowPDF(showId);
    
    return res.json({
      success: true,
      message: 'PDF generated successfully',
      pdfPath: pdfPath
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF',
      error: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});