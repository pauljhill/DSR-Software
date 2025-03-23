/**
 * FileUploader component for uploading files
 */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

/**
 * FileUploader component for uploading files
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const FileUploader = ({
  onUpload,
  isUploading,
  uploadError,
  uploadSuccess,
  fileTypes,
  title = 'Upload File',
  accept = '*/*',
  multiple = false,
  buttonVariant = 'contained'
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Try to guess file type based on name if fileTypes are provided
      if (fileTypes && fileTypes.length > 0) {
        const fileName = file.name.toLowerCase();
        if (fileName.includes('risk') || fileName.includes('assessment')) {
          const riskType = fileTypes.find(type => type.includes('Risk'));
          if (riskType) setSelectedType(riskType);
        } else if (fileName.includes('setup') || fileName.includes('photo')) {
          const photoType = fileTypes.find(type => type.includes('Photo'));
          if (photoType) setSelectedType(photoType);
        } else {
          setSelectedType(fileTypes[0]);
        }
      }
    }
  };
  
  // Handle click on upload button to open file dialog
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };
  
  // Handle type selection change
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };
  
  // Submit file for upload
  const handleSubmitUpload = () => {
    if (selectedFile && (!fileTypes.length || selectedType)) {
      onUpload(selectedFile, selectedType);
      // Reset after upload
      setSelectedFile(null);
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2 }}>
      {title && (
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={buttonVariant}
            component="span"
            onClick={handleClickUpload}
            startIcon={<UploadIcon />}
            disabled={isUploading}
          >
            Select File
          </Button>
          
          {selectedFile && (
            <Typography variant="body2" sx={{ 
              alignSelf: 'center', 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}>
              {selectedFile.name}
            </Typography>
          )}
        </Box>
        
        {fileTypes && fileTypes.length > 0 && selectedFile && (
          <FormControl fullWidth margin="normal" size="small">
            <InputLabel id="file-type-select-label">File Type</InputLabel>
            <Select
              labelId="file-type-select-label"
              value={selectedType}
              onChange={handleTypeChange}
              label="File Type"
              disabled={isUploading}
            >
              {fileTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {selectedFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitUpload}
            disabled={isUploading || (fileTypes.length > 0 && !selectedType)}
            sx={{ mt: 2 }}
          >
            Upload
          </Button>
        )}
        
        {isUploading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
        )}
        
        {uploadError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {uploadError}
          </Alert>
        )}
        
        {uploadSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            File uploaded successfully!
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

FileUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
  isUploading: PropTypes.bool,
  uploadError: PropTypes.string,
  uploadSuccess: PropTypes.bool,
  fileTypes: PropTypes.array,
  title: PropTypes.string,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  buttonVariant: PropTypes.string
};

export default FileUploader;