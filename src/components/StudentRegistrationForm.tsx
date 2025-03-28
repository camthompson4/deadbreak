import React, { useState, useRef } from 'react';
import { 
  Typography, 
  InputAdornment, 
  IconButton, 
  Box,
  FormControlLabel,
  Checkbox,
  Input,
  Button,
  FormHelperText,
  Alert
} from '@mui/material';
import {
  StyledForm,
  FormPaper,
  StyledTextField,
  FormButton,
  useFormError,
} from './shared/FormComponents';
import { LoadingButton } from './shared/LoadingComponents';
import { CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface StudentRegistrationFormProps {
  onSubmit: (formData: StudentRegistrationData) => void;
  loading?: boolean;
  error?: string;
}

export interface StudentRegistrationData {
  fullName: string;
  phoneNumber: string;
  email: string;
  ssnLast4: string;
  headshot?: File;
  optInAlerts: boolean;
}

export function StudentRegistrationForm({ onSubmit, loading, error }: StudentRegistrationFormProps) {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    ssnLast4: '',
    optInAlerts: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    ssnLast4: '',
    headshot: ''
  });

  const [headshotPreview, setHeadshotPreview] = useState<string>('');
  const fullNameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const ssnRef = useRef<HTMLDivElement>(null);
  const { triggerErrorAnimation } = useFormError();

  // Validate phone number format
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });
    setFieldErrors({
      ...fieldErrors,
      phoneNumber: validatePhoneNumber(formatted) ? '' : 'Invalid phone number format'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFieldErrors({
          ...fieldErrors,
          headshot: 'File size must be less than 5MB'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, headshot: file });
      setFieldErrors({ ...fieldErrors, headshot: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      fullName: !formData.fullName ? 'Name is required' : '',
      phoneNumber: !validatePhoneNumber(formData.phoneNumber) ? 'Invalid phone number' : '',
      email: !validateEmail(formData.email) ? 'Invalid email address' : '',
      ssnLast4: !/^\d{4}$/.test(formData.ssnLast4) ? 'Must be 4 digits' : '',
      headshot: ''
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <FormPaper>
      <Box p={3}>
        <StyledForm onSubmit={handleSubmit}>
          <StyledTextField
            ref={fullNameRef}
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              setFieldErrors({ ...fieldErrors, fullName: '' });
            }}
            error={!!fieldErrors.fullName}
            helperText={fieldErrors.fullName}
            required
            margin="normal"
          />
          
          <StyledTextField
            ref={phoneRef}
            fullWidth
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            error={!!fieldErrors.phoneNumber}
            helperText={fieldErrors.phoneNumber || '(123) 456-7890'}
            required
            margin="normal"
          />

          <StyledTextField
            ref={emailRef}
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
          />

          <StyledTextField
            ref={ssnRef}
            fullWidth
            label="Last 4 Digits of SSN"
            value={formData.ssnLast4}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, ssnLast4: value });
              setFieldErrors({
                ...fieldErrors,
                ssnLast4: /^\d{4}$/.test(value) ? '' : 'Must be 4 digits'
              });
            }}
            error={!!fieldErrors.ssnLast4}
            helperText={fieldErrors.ssnLast4}
            inputProps={{ maxLength: 4 }}
            required
            margin="normal"
          />

          <Box sx={{ mb: 3, mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              sx={{
                width: '100%',
                color: '#ff1a1a',
                borderColor: '#ff1a1a',
                '&:hover': {
                  borderColor: '#cc0000',
                  color: '#cc0000',
                }
              }}
            >
              Upload Headshot
              <VisuallyHiddenInput 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {fieldErrors.headshot && (
              <FormHelperText error>{fieldErrors.headshot}</FormHelperText>
            )}
            {headshotPreview && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={headshotPreview} 
                  alt="Headshot preview" 
                  style={{ 
                    maxWidth: '100px',
                    maxHeight: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #333333'
                  }} 
                />
              </Box>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.optInAlerts}
                onChange={(e) => setFormData({ ...formData, optInAlerts: e.target.checked })}
                sx={{
                  color: '#ff1a1a',
                  '&.Mui-checked': {
                    color: '#ff1a1a',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'white' }}>
                I agree to receive alerts and notifications*
              </Typography>
            }
            required
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
              disabled={loading || !formData.optInAlerts}
            >
              Register
            </FormButton>
          )}
        </StyledForm>
      </Box>
    </FormPaper>
  );
} 