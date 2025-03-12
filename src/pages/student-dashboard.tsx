import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function StudentDashboard() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Student Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          Welcome to your learning portal
        </Typography>
        {/* Add student-specific content here */}
      </Paper>
    </Container>
  );
} 