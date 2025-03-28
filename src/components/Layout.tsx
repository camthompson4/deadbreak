import React from 'react';
import { AppBar, Toolbar, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logo } from './Logo';
import { brandColors } from './BrandStyleGuide';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'black',
  borderBottom: '1px solid #333333',
}));

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: brandColors.background.dark,
      color: 'white'
    }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Logo size="small" />
        </Toolbar>
      </StyledAppBar>
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
} 