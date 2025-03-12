import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

export function StudentLogin() {
  const router = useRouter();

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          Student Login
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Manage student access and registrations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/login?tab=student')}
        >
          Go to Student Login
        </Button>
      </CardContent>
    </Card>
  );
} 