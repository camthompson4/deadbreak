import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export function CourseManagement() {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Course Management
        </Typography>
        <Typography color="text.secondary">
          Course management features coming soon...
        </Typography>
      </CardContent>
    </Card>
  );
} 