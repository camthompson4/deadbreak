import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { Logo } from '../components/Logo';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(45deg, #000000 30%, #1a1a1a 90%)',
  color: 'white',
  textAlign: 'center',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: '#ff1a1a',
    boxShadow: '0 4px 20px rgba(255, 26, 26, 0.2)',
  },
}));

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login'); // This will redirect to the login/registration page
  };

  const handleLearnMore = () => {
    router.push('/about');
  };

  return (
    <Box>
      <HeroSection>
        <Container>
          <Box sx={{ mb: 4 }}>
            <Logo size="large" showTagline />
          </Box>
          <Typography variant="h5" sx={{ mb: 6, color: '#b3b3b3' }}>
            DeadBreak: Professional Breaking Education
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleGetStarted}
              sx={{
                bgcolor: '#ff1a1a',
                '&:hover': { bgcolor: '#cc0000' }
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={handleLearnMore}
              sx={{
                borderColor: '#ff1a1a',
                color: '#ff1a1a',
                '&:hover': { borderColor: '#cc0000', color: '#cc0000' }
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Typography variant="h5" gutterBottom sx={{ color: '#ff1a1a' }}>
                Interactive Learning
              </Typography>
              <Typography>
                Engage with our interactive lessons and real-time feedback system
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Typography variant="h5" gutterBottom sx={{ color: '#ff1a1a' }}>
                Expert Instructors
              </Typography>
              <Typography>
                Learn from professional breakers with years of experience
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <Typography variant="h5" gutterBottom sx={{ color: '#ff1a1a' }}>
                Track Progress
              </Typography>
              <Typography>
                Monitor your improvement with detailed analytics and achievements
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 