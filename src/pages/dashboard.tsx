import React from 'react';
import { Container, Typography } from '@mui/material';
import { TeacherDashboard } from '../components/TeacherDashboard';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Dead Break Education
      </Typography>
      <TeacherDashboard teacherId="test-teacher" />
    </Container>
  );
} 