const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const winston = require('winston');
const { generateShowPDF, updateShowPDFFlag } = require('./pdf-service');

const app = express();
const port = process.env.PORT || 3001;

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' })
  ],
});

// Configure CORS to allow frontend to communicate with backend
app.use(cors());

// Parse JSON body
app.use(bodyParser.json());

// Set up static file serving
app.use('/data', express.static(path.join(__dirname, '../data')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const showId = req.params.showId;
    const showsDir = path.join(__dirname, '../data/shows');
    
    // Read the shows.csv to get the show folder name
    const showsFile = path.join(__dirname, '../data/shows.csv');
    let folderName = 'default'; // Default folder if show not found
    
    try {
      const content = fs.readFileSync(showsFile, 'utf8');
      const records = parse(content, { columns: true, skip_empty_lines: true });
      
      const show = records.find(record => record.show_id === showId);
      if (show && show.folder_name) {
        folderName = show.folder_name;
      } else {
        logger.warn(`Show ID ${showId} not found in shows.csv, using default folder`);
      }
    } catch (err) {
      logger.error(`Error reading shows.csv: ${err.message}`);
    }
    
    const dir = path.join(showsDir, folderName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Endpoint to get all shows
app.get('/api/shows', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/shows.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    logger.info(`Retrieved ${records.length} shows`);
    res.json(records);
  } catch (err) {
    logger.error(`Error reading shows.csv: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get a specific show
app.get('/api/shows/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/shows.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    
    const show = records.find(record => record.show_id === req.params.id);
    
    if (show) {
      logger.info(`Retrieved show ${req.params.id}`);
      res.json(show);
    } else {
      logger.warn(`Show ${req.params.id} not found`);
      res.status(404).json({ error: 'Show not found' });
    }
  } catch (err) {
    logger.error(`Error reading shows.csv: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to create a new show
app.post('/api/shows', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/shows.csv');
    let content = fs.readFileSync(filePath, 'utf8');
    let records = parse(content, { columns: true, skip_empty_lines: true });
    
    // Check if show_id already exists
    const existingShow = records.find(record => record.show_id === req.body.show_id);
    if (existingShow) {
      logger.warn(`Show ID ${req.body.show_id} already exists`);
      return res.status(400).json({ error: 'Show ID already exists' });
    }
    
    // Add the new show
    records.push(req.body);
    
    // Write back to CSV
    const output = stringify(records, { header: true });
    fs.writeFileSync(filePath, output);
    
    logger.info(`Created new show: ${req.body.show_id}`);
    res.status(201).json(req.body);
  } catch (err) {
    logger.error(`Error creating show: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a show
app.put('/api/shows/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/shows.csv');
    let content = fs.readFileSync(filePath, 'utf8');
    let records = parse(content, { columns: true, skip_empty_lines: true });
    
    // Find the show index
    const index = records.findIndex(record => record.show_id === req.params.id);
    
    if (index === -1) {
      logger.warn(`Show ${req.params.id} not found for update`);
      return res.status(404).json({ error: 'Show not found' });
    }
    
    // Update the show
    records[index] = { ...records[index], ...req.body };
    
    // Make sure the show_id doesn't change
    records[index].show_id = req.params.id;
    
    // Write back to CSV
    const output = stringify(records, { header: true });
    fs.writeFileSync(filePath, output);
    
    logger.info(`Updated show: ${req.params.id}`);
    res.json(records[index]);
  } catch (err) {
    logger.error(`Error updating show: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to delete a show
app.delete('/api/shows/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/shows.csv');
    let content = fs.readFileSync(filePath, 'utf8');
    let records = parse(content, { columns: true, skip_empty_lines: true });
    
    // Filter out the show to delete
    const filteredRecords = records.filter(record => record.show_id !== req.params.id);
    
    // Check if any record was filtered out
    if (filteredRecords.length === records.length) {
      logger.warn(`Show ${req.params.id} not found for deletion`);
      return res.status(404).json({ error: 'Show not found' });
    }
    
    // Write back to CSV
    const output = stringify(filteredRecords, { header: true });
    fs.writeFileSync(filePath, output);
    
    logger.info(`Deleted show: ${req.params.id}`);
    res.json({ message: 'Show deleted successfully' });
  } catch (err) {
    logger.error(`Error deleting show: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to upload files for a specific show
app.post('/api/shows/:showId/upload', upload.array('files'), (req, res) => {
  logger.info(`Uploaded ${req.files.length} files for show ${req.params.showId}`);
  res.json({ message: 'Files uploaded successfully', files: req.files.map(file => file.filename) });
});

// Endpoint to get files for a specific show
app.get('/api/shows/:showId/files', (req, res) => {
  const showId = req.params.showId;
  const showsFile = path.join(__dirname, '../data/shows.csv');
  let folderName = 'default';
  
  try {
    const content = fs.readFileSync(showsFile, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    
    const show = records.find(record => record.show_id === showId);
    if (show && show.folder_name) {
      folderName = show.folder_name;
    } else {
      logger.warn(`Show ID ${showId} not found in shows.csv, using default folder`);
    }
  } catch (err) {
    logger.error(`Error reading shows.csv: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
  
  const dir = path.join(__dirname, '../data/shows', folderName);
  
  if (!fs.existsSync(dir)) {
    logger.warn(`Directory not found: ${dir}`);
    return res.json([]);
  }
  
  try {
    const files = fs.readdirSync(dir)
      .filter(file => fs.statSync(path.join(dir, file)).isFile())
      .map(file => ({
        name: file,
        path: `/data/shows/${folderName}/${file}`,
        size: fs.statSync(path.join(dir, file)).size,
        lastModified: fs.statSync(path.join(dir, file)).mtime
      }));
    
    logger.info(`Retrieved ${files.length} files for show ${showId}`);
    res.json(files);
  } catch (err) {
    logger.error(`Error reading directory: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get venues
app.get('/api/venues', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/venues.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    logger.info(`Retrieved ${records.length} venues`);
    res.json(records);
  } catch (err) {
    logger.error(`Error reading venues.csv: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get equipment
app.get('/api/equipment', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/equipment.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    logger.info(`Retrieved ${records.length} equipment items`);
    res.json(records);
  } catch (err) {
    logger.error(`Error reading equipment.csv: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get airports
app.get('/api/airports', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/airports.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    logger.info(`Retrieved ${records.length} airports`);
    res.json(records);
  } catch (err) {
    logger.error(`Error reading airports.csv: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to generate PDF for a specific show
app.post('/api/pdf/generate/:id', async (req, res) => {
  try {
    const showId = req.params.id;
    logger.info(`Generating PDF for show ${showId}`);
    
    const pdfPath = await generateShowPDF(showId);
    
    if (pdfPath) {
      // Update the show record to mark PDF as generated
      await updateShowPDFFlag(showId, true);
      
      logger.info(`PDF generated successfully: ${pdfPath}`);
      res.json({ success: true, message: 'PDF generated successfully', pdfPath });
    } else {
      logger.error(`Failed to generate PDF for show ${showId}`);
      res.status(500).json({ success: false, message: 'PDF generation failed' });
    }
  } catch (err) {
    logger.error(`Error generating PDF: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`);
});
