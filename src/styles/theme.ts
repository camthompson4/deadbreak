import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff1a1a', // Bright red
      light: '#ff4d4d',
      dark: '#cc0000',
    },
    secondary: {
      main: '#4a4a4a', // Graphite
      light: '#707070',
      dark: '#2d2d2d',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#ff1a1a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01562em',
      color: '#ffffff',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.00833em',
      color: '#ffffff',
    },
    h5: {
      fontWeight: 500,
      color: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          backgroundColor: '#ff1a1a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#cc0000',
          },
        },
        outlined: {
          borderColor: '#ff1a1a',
          color: '#ff1a1a',
          '&:hover': {
            borderColor: '#cc0000',
            color: '#cc0000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          border: '1px solid #333333',
          '&:hover': {
            borderColor: '#ff1a1a',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          border: '1px solid #333333',
        },
      },
    },
  },
}); 