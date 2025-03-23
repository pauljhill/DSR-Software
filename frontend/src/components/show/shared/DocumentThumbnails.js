/**
 * DocumentThumbnails component for displaying file thumbnails
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * DocumentThumbnails component for displaying file thumbnails
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const DocumentThumbnails = ({
  title,
  files,
  getFileUrl,
  onViewFile,
  onDeleteFile,
  emptyMessage = 'No files uploaded',
  showFileType = true,
  maxHeight = '300px'
}) => {
  // Get icon based on file type
  const getFileIcon = (fileName) => {
    if (!fileName) return <FileIcon />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return <PdfIcon color="error" />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return <ImageIcon color="primary" />;
    } else {
      return <FileIcon color="action" />;
    }
  };
  
  // Open file in new tab
  const handleDownload = (fileName) => {
    const fileUrl = getFileUrl(fileName);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };
  
  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2, mt: 2 }}>
      {title && (
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box sx={{ maxHeight, overflowY: 'auto' }}>
        {files && files.length > 0 ? (
          <List dense>
            {files.map((file, index) => (
              <ListItem key={index} divider={index < files.length - 1}>
                <ListItemIcon>
                  {getFileIcon(file.filename)}
                </ListItemIcon>
                <ListItemText 
                  primary={file.filename}
                  secondary={showFileType ? `Type: ${file.type || 'Unknown'}` : null}
                  primaryTypographyProps={{ 
                    style: { 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    } 
                  }}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="View">
                    <IconButton 
                      edge="end" 
                      aria-label="view" 
                      onClick={() => onViewFile(file.filename, file.type)}
                      size="small"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton 
                      edge="end" 
                      aria-label="download" 
                      onClick={() => handleDownload(file.filename)}
                      size="small"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => onDeleteFile(file.filename, file.type)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

DocumentThumbnails.propTypes = {
  title: PropTypes.string,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      type: PropTypes.string
    })
  ).isRequired,
  getFileUrl: PropTypes.func.isRequired,
  onViewFile: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
  showFileType: PropTypes.bool,
  maxHeight: PropTypes.string
};

export default DocumentThumbnails;