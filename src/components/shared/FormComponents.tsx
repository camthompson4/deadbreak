import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  TextField, 
  Button, 
  Paper, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Radio,
  Switch
} from '@mui/material';
import { fadeIn, shake, glow } from '../../utils/animations';

export const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  padding: theme.spacing(3),
  animation: `${fadeIn} 0.5s ease-out`,
}));

export const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#1a1a1a',
  border: '1px solid #333333',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#262626',
    color: 'white',
    '& fieldset': {
      borderColor: '#333333',
    },
    '&:hover fieldset': {
      borderColor: '#ff1a1a',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff1a1a',
    },
    '&.error': {
      animation: `${shake} 0.5s ease-in-out`,
    }
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#ff1a1a',
    }
  },
}));

export const FormButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#ff1a1a',
  color: 'white',
  '&:hover': {
    backgroundColor: '#cc0000',
  },
  '&.Mui-disabled': {
    backgroundColor: '#4d4d4d',
    color: '#666666',
  }
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#333333',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.primary.main,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.MuiMenuItem-root': {
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 26, 26, 0.1)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(255, 26, 26, 0.2)',
      '&:hover': {
        backgroundColor: 'rgba(255, 26, 26, 0.3)',
      },
    },
  },
}));

export const FormDivider = styled(Box)(({ theme }) => ({
  height: '2px',
  background: 'linear-gradient(90deg, #ff1a1a 0%, #4d4d4d 100%)',
  margin: theme.spacing(2, 0),
}));

export const FormCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#666666',
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

export const FormRadio = styled(Radio)(({ theme }) => ({
  color: '#666666',
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
}));

export const FormSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    '&.Mui-checked': {
      color: theme.palette.primary.main,
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#666666',
  },
}));

export const useFormError = () => {
  const [hasError, setHasError] = useState(false);

  const triggerErrorAnimation = (inputRef: React.RefObject<HTMLDivElement>) => {
    if (inputRef.current) {
      setHasError(true);
      inputRef.current.classList.add('error');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.classList.remove('error');
          setHasError(false);
        }
      }, 500);
    }
  };

  return { hasError, triggerErrorAnimation };
}; 