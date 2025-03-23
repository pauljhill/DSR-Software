const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

// Create express app
const app = express();
const PORT = 3001;

// Basic settings
app.use(cors());
app.use(express.json());
app.use(express.text());

// Set data directory path (relative to project root)
const DATA_DIR = path.join(__dirname, '..', 'data');
console.log(`Data directory set to: ${DATA_DIR}`);

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);
console.log(`Ensured data directory exists: ${DATA_DIR}`);

// Ensure shows directory exists
const SHOWS_DIR = path.join(DATA_DIR, 'shows');
fs.ensureDirSync(SHOWS_DIR);
console.log(`Ensured shows directory exists: ${SHOWS_DIR}`);

// Import PDF service
const pdfService = require('./pdf-service');

// CSV File Operations

// Read CSV file
app.get('/data/:filename', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.filename);
    console.log(`Reading file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    res.status(500).send(`Error reading file: ${error.message}`);
  }
});

// Write CSV file
app.put('/data/:filename', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.filename);
    console.log(`Writing file: ${filePath}`);
    
    // Ensure the directory exists
    fs.ensureDirSync(path.dirname(filePath));
    
    // If updating shows.csv, check if we need to flag shows for PDF updates
    if (req.params.filename === 'shows.csv') {
      console.log('Updating shows.csv - checking for changes that require PDF updates');
      
      // If the file already exists, we'll compare data to detect changes
      if (fs.existsSync(filePath)) {
        const currentContent = fs.readFileSync(filePath, 'utf8');
        const newContent = req.body;
        
        // We're not doing deep comparison here, just assuming any change to shows.csv
        // requires updating the PDFs. In a more sophisticated implementation,
        // you might want to parse both CSVs and only flag changed shows.
        if (currentContent !== newContent) {
          // Set pdf_needs_update flag for all shows in the new content
          const rows = newContent.split('\n');
          
          // We'll handle this flag in a background process to avoid blocking the API
          console.log('Changes detected in shows.csv - flagging shows for PDF updates');
          
          // Instead of modifying the incoming data, we'll just write it and
          // let the background PDF update process handle the flags
        }
      }
    }
    
    // Write the file
    fs.writeFileSync(filePath, req.body);
    
    // If we just updated shows.csv, flag all shows for PDF updates
    if (req.params.filename === 'shows.csv') {
      // Flag shows for PDF updates in a non-blocking way
      setTimeout(async () => {
        try {
          const showsData = await pdfService.readCSVFile('shows.csv');
          
          // Flag each show for update
          for (const show of showsData) {
            if (show.id) {
              await pdfService.updateShowPDFFlag(show.id, true);
            }
          }
          
          console.log('All shows flagged for PDF updates');
        } catch (error) {
          console.error('Error flagging shows for PDF updates:', error);
        }
      }, 0);
    }
    
    res.send('File updated successfully');
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    res.status(500).send(`Error writing file: ${error.message}`);
  }
});

// Folder and File Operations

// Create folder
app.post('/api/createFolder', (req, res) => {
  try {
    const { folderPath } = req.body;
    
    if (!folderPath) {
      return res.status(400).send('folderPath is required');
    }
    
    // Prevent path traversal
    const normalizedPath = path.normalize(folderPath).replace(/^(\.\.(/|\\|$))+/, '');
    const fullPath = path.join(DATA_DIR, normalizedPath);
    
    console.log(`Creating folder: ${fullPath}`);
    
    // Create directory with fs-extra
    fs.ensureDirSync(fullPath);
    
    res.send(`Folder created: ${folderPath}`);
  } catch (error) {
    console.error(`Error creating folder: ${error.message}`);
    res.status(500).send(`Error creating folder: ${error.message}`);
  }
});

// File upload - Direct file saving approach
const Busboy = require('busboy');

app.post('/api/upload', (req, res) => {
  try {
    console.log('File upload request received');
    
    const busboy = Busboy({ headers: req.headers });
    let showFolder = 'default';
    let uploadFilePath = null;
    let originalFilename = null;
    
    // Handle non-file fields
    busboy.on('field', (fieldname, val) => {
      console.log(`Field: ${fieldname} = ${val}`);
      if (fieldname === 'showFolder') {
        showFolder = val || 'default';
      }
    });
    
    // Handle file upload
    busboy.on('file', (fieldname, fileStream, filename, encoding, mimetype) => {
      console.log(`Processing file: ${filename}, mimetype: ${mimetype}`);
      
      // Create normalized folder path
      const normalizedShowFolder = path.normalize(showFolder).replace(/^(\.\.(/|\\|$))+/, '');
      const targetDir = path.join(SHOWS_DIR, normalizedShowFolder);
      
      // Ensure target directory exists
      fs.ensureDirSync(targetDir);
      console.log(`Ensured target directory exists: ${targetDir}`);
      
      // Set upload path for this file
      originalFilename = filename.filename || 'upload.bin';
      uploadFilePath = path.join(targetDir, originalFilename);
      console.log(`Saving file to: ${uploadFilePath}`);
      
      // Create write stream
      const writeStream = fs.createWriteStream(uploadFilePath);
      
      // Pipe file data to the file
      fileStream.pipe(writeStream);
      
      // Handle completion of the file write
      writeStream.on('finish', () => {
        console.log(`File saved: ${uploadFilePath}`);
      });
      
      // Handle file write errors
      writeStream.on('error', (err) => {
        console.error(`Error writing file: ${err.message}`);
      });
    });
    
    // Handle the end of form parsing
    busboy.on('finish', () => {
      console.log('Upload processing finished');
      
      // Double check file exists
      if (uploadFilePath && fs.existsSync(uploadFilePath)) {
        console.log(`Confirmed file exists: ${uploadFilePath}`);
        const stats = fs.statSync(uploadFilePath);
        console.log(`File size: ${stats.size} bytes`);
      } else {
        console.error(`File not found at expected path: ${uploadFilePath}`);
      }
      
      // Return response to client
      const relativePath = uploadFilePath ? 
        `shows/${showFolder}/${originalFilename}` : 
        null;
      
      res.json({
        message: uploadFilePath ? 'File uploaded successfully' : 'Upload processed but file may not be saved',
        filePath: relativePath
      });
    });
    
    // Start processing the request
    req.pipe(busboy);
    
  } catch (error) {
    console.error(`Error in upload handler: ${error.message}`);
    console.error(error.stack);
    res.status(500).send(`Error uploading file: ${error.message}`);
  }
});

// List files
app.get('/api/listFiles/:folderPath(*)', (req, res) => {
  try {
    const folderPath = req.params.folderPath || '';
    
    // Prevent path traversal
    const normalizedPath = path.normalize(folderPath).replace(/^(\.\.(/|\\|$))+/, '');
    const fullPath = path.join(DATA_DIR, normalizedPath);
    
    console.log(`Listing files in: ${fullPath}`);
    
    // Check if directory exists
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      return res.status(404).json({
        error: `Directory not found: ${folderPath}`
      });
    }
    
    // Get files and folders
    const items = fs.readdirSync(fullPath);
    
    // Prepare result with file details
    const result = items.map(item => {
      const itemPath = path.join(fullPath, item);
      const stats = fs.statSync(itemPath);
      
      return {
        name: item,
        path: path.join(folderPath, item).replace(/\\/g, '/'),
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modified: stats.mtime
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error(`Error listing files: ${error.message}`);
    res.status(500).json({
      error: `Error listing files: ${error.message}`
    });
  }
});

// Delete file
app.delete('/api/deleteFile', (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).send('filePath is required');
    }
    
    // Prevent path traversal
    const normalizedPath = path.normalize(filePath).replace(/^(\.\.(/|\\|$))+/, '');
    const fullPath = path.join(DATA_DIR, normalizedPath);
    
    console.log(`Deleting file: ${fullPath}`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).send(`File not found: ${filePath}`);
    }
    
    // Delete file
    fs.unlinkSync(fullPath);
    
    res.send(`File deleted: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    res.status(500).send(`Error deleting file: ${error.message}`);
  }
});

// Move/Rename file
app.post('/api/moveFile', (req, res) => {
  try {
    const { sourcePath, destinationPath } = req.body;
    
    if (!sourcePath || !destinationPath) {
      return res.status(400).send('sourcePath and destinationPath are required');
    }
    
    // Prevent path traversal
    const normalizedSourcePath = path.normalize(sourcePath).replace(/^(\.\.(/|\\|$))+/, '');
    const normalizedDestPath = path.normalize(destinationPath).replace(/^(\.\.(/|\\|$))+/, '');
    
    const sourceFullPath = path.join(DATA_DIR, normalizedSourcePath);
    const destFullPath = path.join(DATA_DIR, normalizedDestPath);
    
    console.log(`Moving file from ${sourceFullPath} to ${destFullPath}`);
    
    // Check if source exists
    if (!fs.existsSync(sourceFullPath)) {
      return res.status(404).send(`Source file not found: ${sourcePath}`);
    }
    
    // Ensure destination directory exists
    fs.ensureDirSync(path.dirname(destFullPath));
    
    // Move file
    fs.moveSync(sourceFullPath, destFullPath, { overwrite: true });
    
    res.send(`File moved from ${sourcePath} to ${destinationPath}`);
  } catch (error) {
    console.error(`Error moving file: ${error.message}`);
    res.status(500).send(`Error moving file: ${error.message}`);
  }
});

// PDF Generation

// Generate PDF for a show
app.post('/api/generatePDF/:showId', async (req, res) => {
  try {
    const { showId } = req.params;
    
    if (!showId) {
      return res.status(400).send('showId is required');
    }
    
    console.log(`Generating PDF for show: ${showId}`);
    
    // Generate PDF using the PDF service
    const pdfPath = await pdfService.generateShowPDF(showId);
    
    res.json({
      message: 'PDF generated successfully',
      pdfPath
    });
  } catch (error) {
    console.error(`Error generating PDF: ${error.message}`);
    res.status(500).send(`Error generating PDF: ${error.message}`);
  }
});

// Download PDF for a show
app.get('/api/downloadPDF/:showId', (req, res) => {
  try {
    const { showId } = req.params;
    
    if (!showId) {
      return res.status(400).send('showId is required');
    }
    
    console.log(`Downloading PDF for show: ${showId}`);
    
    // Find the show folder
    const showFolders = fs.readdirSync(SHOWS_DIR);
    let showFolder = null;
    
    for (const folder of showFolders) {
      if (folder.startsWith(showId)) {
        showFolder = folder;
        break;
      }
    }
    
    if (!showFolder) {
      return res.status(404).send(`Show folder not found for ID: ${showId}`);
    }
    
    const pdfPath = path.join(SHOWS_DIR, showFolder, 'dsr.pdf');
    
    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send(`PDF not found for show: ${showId}`);
    }
    
    // Send the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="DSR-${showId}.pdf"`);
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(`Error downloading PDF: ${error.message}`);
    res.status(500).send(`Error downloading PDF: ${error.message}`);
  }
});

// Find the show folder from ID
function findShowFolderPath(showId) {
  if (!showId) return null;
  
  const showFolders = fs.readdirSync(SHOWS_DIR);
  let showFolder = null;
  
  for (const folder of showFolders) {
    if (folder.startsWith(showId)) {
      showFolder = folder;
      break;
    }
  }
  
  return showFolder ? path.join(SHOWS_DIR, showFolder) : null;
}

// Get show documents
app.get('/api/showDocuments/:showId', (req, res) => {
  try {
    const { showId } = req.params;
    
    if (!showId) {
      return res.status(400).send('showId is required');
    }
    
    console.log(`Getting documents for show: ${showId}`);
    
    // Find the show folder
    const showFolderPath = findShowFolderPath(showId);
    
    if (!showFolderPath) {
      return res.status(404).json({
        error: `Show folder not found for ID: ${showId}`,
        documents: []
      });
    }
    
    // Create files directory if it doesn't exist
    const filesDir = path.join(showFolderPath, 'files');
    fs.ensureDirSync(filesDir);
    
    // Check if PDF exists
    const pdfPath = path.join(showFolderPath, 'dsr.pdf');
    const pdfExists = fs.existsSync(pdfPath);
    
    // Get files in the files directory
    const files = fs.readdirSync(filesDir).map(file => ({
      name: file,
      path: `shows/${path.basename(showFolderPath)}/files/${file}`,
      type: 'file'
    }));
    
    // Add PDF if it exists
    const documents = [];
    
    if (pdfExists) {
      documents.push({
        name: 'DSR.pdf',
        path: `shows/${path.basename(showFolderPath)}/dsr.pdf`,
        type: 'pdf'
      });
    }
    
    // Combine with other files
    documents.push(...files);
    
    res.json({
      documents
    });
  } catch (error) {
    console.error(`Error getting show documents: ${error.message}`);
    res.status(500).json({
      error: `Error getting show documents: ${error.message}`,
      documents: []
    });
  }
});

// Server Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  
  // Start background PDF update process
  console.log('Starting background PDF update process, checking every 60 seconds');
  
  // Initial check
  setTimeout(async () => {
    try {
      await pdfService.checkAndUpdatePDFs();
    } catch (error) {
      console.error('Error in PDF update process:', error);
    }
  }, 5000); // Wait 5 seconds before first check
  
  // Periodic check every minute
  setInterval(async () => {
    try {
      console.log('Checking for shows needing PDF updates...');
      const updated = await pdfService.checkAndUpdatePDFs();
      console.log(`Found ${updated} shows needing PDF updates`);
    } catch (error) {
      console.error('Error in PDF update process:', error);
    }
  }, 60000); // Check every minute
});
