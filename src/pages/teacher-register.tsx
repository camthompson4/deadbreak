import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function TeacherRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { createUserWithEmailAndPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, verify the registration code
      const codeResponse = await fetch('/api/auth/verify-teacher-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: registrationCode })
      });

      if (!codeResponse.ok) {
        throw new Error('Invalid registration code');
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(email, password);
      
      // Register as teacher
      const response = await fetch('/api/auth/teacher-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          uid: userCredential.user.uid,
          registrationCode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to register as teacher');
      }

      // Set role in localStorage before navigation
      localStorage.setItem('userRole', 'teacher');
      
      // Use replace instead of push to prevent back navigation
      await router.replace('/teacher-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Teacher Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Registration Code"
            type="text"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
            margin="normal"
            required
            helperText="Enter the teacher registration code provided by the administrator"
          />

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
} 