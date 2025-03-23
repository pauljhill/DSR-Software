import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Box>
    </Box>
  );
}