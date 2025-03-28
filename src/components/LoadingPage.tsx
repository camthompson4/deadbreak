import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export function LoadingPage() {
  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
      }}
    >
      <CircularProgress sx={{ color: '#ff1a1a' }} />
    </Box>
  );
} 