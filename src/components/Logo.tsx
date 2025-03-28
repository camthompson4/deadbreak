import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LogoTagline = styled(Typography)(({ theme }) => ({
  fontFamily: '"Orbitron", sans-serif', // Futuristic font
  color: '#A0A0A0',
  letterSpacing: '0.1em',
  fontSize: '0.75rem',
  fontWeight: 500,
}));

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'medium', showTagline = false, className }: LogoProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 60 };
      case 'large':
        return { width: 300, height: 150 };
      default:
        return { width: 200, height: 100 };
    }
  };

  const { width, height } = getSize();

  return (
    <LogoContainer className={className}>
      <Image
        src="/logo.jpg"
        alt="DeadBreak - Your Training Partners"
        width={width}
        height={height}
        priority
        style={{
          maxWidth: '100%',
          height: 'auto',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
        }}
      />
      {showTagline && (
        <LogoTagline variant="subtitle2">
          YOUR TRAINING PARTNERS
        </LogoTagline>
      )}
    </LogoContainer>
  );
} 