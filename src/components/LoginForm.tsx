import React, { useState } from 'react';
import { 
  Typography, 
  InputAdornment, 
  IconButton, 
  Box,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import {
  StyledForm,
  FormPaper,
  StyledTextField,
  FormButton,
} from './shared/FormComponents';
import { LoadingButton } from './shared/LoadingComponents';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password requirements
  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must include a number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must include a special character';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      email: !validateEmail(formData.email) ? 'Invalid email address' : '',
      password: validatePassword(formData.password)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    onSubmit(formData.email, formData.password);
  };

  return (
    <FormPaper>
      <Box p={3}>
        <StyledForm onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setFieldErrors({
                ...fieldErrors,
                email: validateEmail(e.target.value) ? '' : 'Invalid email address'
              });
            }}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#ff1a1a' }} />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setFieldErrors({
                ...fieldErrors,
                password: validatePassword(e.target.value)
              });
            }}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#ff1a1a' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#ff1a1a' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <LoadingButton />
          ) : (
            <FormButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 3 }}
            >
              Login
            </FormButton>
          )}
        </StyledForm>
      </Box>
    </FormPaper>
  );
} 