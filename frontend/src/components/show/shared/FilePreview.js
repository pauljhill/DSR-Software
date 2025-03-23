/**
 * FilePreview component for displaying file previews
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * FilePreview component for displaying file previews
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const FilePreview = ({
  open,
  onClose,
  fileUrl,
  fileName,
  fileType
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Toggle full screen mode
  const toggleFullScreen = () => {
    setFullScreen(prev => !prev);
  };
  
  // Handle image/document load
  const handleContentLoaded = () => {
    setLoading(false);
    setError(false);
  };
  
  // Handle load error
  const handleError = () => {
    setLoading(false);
    setError(true);
  };
  
  // Download file
  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };
  
  // Determine content based on file type
  const renderPreviewContent = () => {
    if (!fileUrl) return null;
    
    const extension = fileName ? fileName.split('.').pop().toLowerCase() : '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          position: 'relative'
        }}>
          {loading && <LinearProgress sx={{ width: '100%', position: 'absolute', top: 0 }} />}
          <img 
            src={fileUrl} 
            alt={fileName}
            style={{ 
              maxWidth: '100%', 
              maxHeight: fullScreen ? 'calc(100vh - 120px)' : '70vh',
              objectFit: 'contain'
            }}
            onLoad={handleContentLoaded}
            onError={handleError}
          />
        </Box>
      );
    } else if (extension === 'pdf') {
      return (
        <Box sx={{ 
          width: '100%', 
          height: fullScreen ? 'calc(100vh - 120px)' : '70vh',
          position: 'relative'
        }}>
          {loading && <LinearProgress sx={{ width: '100%', position: 'absolute', top: 0 }} />}
          <iframe
            src={`${fileUrl}#view=FitH`}
            title={fileName}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onLoad={handleContentLoaded}
            onError={handleError}
          />
        </Box>
      );
    } else {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            This file type cannot be previewed. Please download to view.
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mt: 2 }}
          >
            Download
          </Button>
        </Box>
      );
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="file-preview-dialog-title"
    >
      <DialogTitle id="file-preview-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ 
            textOverflow: 'ellipsis', 
            overflow: 'hidden', 
            whiteSpace: 'nowrap' 
          }}>
            {fileName}
          </Typography>
          <Box>
            <IconButton
              aria-label="download"
              onClick={handleDownload}
              size="small"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="toggle fullscreen"
              onClick={toggleFullScreen}
              size="small"
            >
              {fullScreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
            </IconButton>
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">
              Error loading file. Please try downloading instead.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ mt: 2 }}
            >
              Download
            </Button>
          </Box>
        ) : (
          renderPreviewContent()
        )}
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
            Download
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

FilePreview.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileUrl: PropTypes.string,
  fileName: PropTypes.string,
  fileType: PropTypes.string
};

export default FilePreview;