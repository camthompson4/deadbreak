import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export function QRCodeGenerator() {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          QR Code Generator
        </Typography>
        <Typography color="text.secondary">
          QR code generation features coming soon...
        </Typography>
      </CardContent>
    </Card>
  );
} 