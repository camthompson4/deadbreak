import { styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import { fadeIn, spin, pulse, shimmer } from '../../utils/animations';

export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
  animation: `${fadeIn} 0.3s ease-out`,
}));

export const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const LoadingButton = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  width: '100%',
  height: '40px',
  background: `linear-gradient(90deg, 
    ${theme.palette.primary.dark}, 
    ${theme.palette.primary.main}, 
    ${theme.palette.primary.dark}
  )`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: theme.spacing(0.5),
}));

export const LoadingText = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  animation: `${pulse} 1.5s ease-in-out infinite`,
  color: theme.palette.primary.main,
}));

export const SkeletonLoader = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '20px',
  background: `linear-gradient(90deg, 
    ${theme.palette.background.paper}, 
    rgba(255, 26, 26, 0.1), 
    ${theme.palette.background.paper}
  )`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 2s infinite linear`,
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
})); 