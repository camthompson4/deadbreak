import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyleGuideSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
}));

const ColorSwatch = styled(Box)(({ bgcolor }: { bgcolor: string }) => ({
  width: 100,
  height: 100,
  backgroundColor: bgcolor,
  borderRadius: 8,
  marginBottom: 8,
  border: '1px solid #333',
}));

export const brandColors = {
  primary: {
    chrome: '#D4D4D4',
    chromeDark: '#8A8A8A',
    chromeLight: '#F5F5F5',
  },
  background: {
    dark: '#121212',
    darker: '#000000',
  },
  accent: {
    red: '#ff1a1a',
    redDark: '#cc0000',
  }
};

export const BrandStyleGuide = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        DeadBreak Brand Style Guide
      </Typography>

      {/* Logo Usage */}
      <StyleGuideSection>
        <Typography variant="h5" gutterBottom>
          Logo Usage
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Minimum Size</Typography>
            <Typography>
              Minimum width: 120px
              Minimum height: 60px
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Clear Space</Typography>
            <Typography>
              Maintain padding equal to 25% of the logo's height around all sides
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">File Formats</Typography>
            <Typography>
              - JPG: General use, dark backgrounds
              - PNG: When transparency needed
              - SVG: Digital interfaces, scalable needs
            </Typography>
          </Grid>
        </Grid>
      </StyleGuideSection>

      {/* Color Palette */}
      <StyleGuideSection>
        <Typography variant="h5" gutterBottom>
          Color Palette
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(brandColors).map(([category, colors]) => (
            Object.entries(colors).map(([name, color]) => (
              <Grid item key={name}>
                <ColorSwatch bgcolor={color} />
                <Typography variant="subtitle2">{name}</Typography>
                <Typography variant="caption">{color}</Typography>
              </Grid>
            ))
          ))}
        </Grid>
      </StyleGuideSection>

      {/* Brand Voice */}
      <StyleGuideSection>
        <Typography variant="h5" gutterBottom>
          Brand Voice
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Key Attributes</Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {['Bold', 'Elite', 'High-Performance', 'Tech-Forward', 'Professional', 'Dynamic'].map((attr) => (
                <Paper key={attr} sx={{ px: 2, py: 1, bgcolor: '#262626' }}>
                  <Typography>{attr}</Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </StyleGuideSection>
    </Box>
  );
}; 