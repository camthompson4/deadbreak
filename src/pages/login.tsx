import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';

export default function LoginPage() {
  const [activeForm, setActiveForm] = useState<'teacher' | 'student' | 'signup' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      switch (activeForm) {
        case 'teacher':
        case 'student': {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const auth = await response.json();
          localStorage.setItem('authToken', auth.token);
          
          router.push(auth.user.role === 'teacher' ? '/dashboard' : '/student-dashboard');
          break;
        }

        case 'signup': {
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            break;
          }

          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const auth = await response.json();
          localStorage.setItem('authToken', auth.token);
          
          router.push('/student-dashboard');
          break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!activeForm) return null;

    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeForm === 'signup' && (
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        {activeForm === 'signup' && (
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        {/* Course Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            Dead Break Education
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Master the Art of Breaking with Professional Training
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Course Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Course Overview
              </Typography>
              <Typography paragraph>
                Join our comprehensive breaking program designed for all skill levels. Learn from experienced
                instructors and develop your unique style in a supportive environment.
              </Typography>

              <List>
                {[
                  'Professional instruction from experienced breakers',
                  'Progressive curriculum from basics to advanced moves',
                  'Regular feedback and progress tracking',
                  'Flexible learning schedule',
                  'Access to exclusive practice sessions'
                ].map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Program Details
              </Typography>
              <Typography paragraph>
                Duration: 12 weeks
                <br />
                Sessions: 3 times per week
                <br />
                Skill Levels: Beginner to Advanced
              </Typography>
            </Paper>
          </Grid>

          {/* Login/Signup Options */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {/* Teacher Login */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SchoolIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
                      <Typography variant="h5">Teacher Portal</Typography>
                    </Box>
                    {activeForm === 'teacher' ? renderForm() : (
                      <Typography color="text.secondary">
                        Access your teaching dashboard and manage student progress
                      </Typography>
                    )}
                  </CardContent>
                  {!activeForm && (
                    <CardActions>
                      <Button 
                        startIcon={<LoginIcon />}
                        onClick={() => setActiveForm('teacher')}
                        variant="contained"
                        fullWidth
                      >
                        Teacher Login
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>

              {/* Student Login */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LoginIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
                      <Typography variant="h5">Student Login</Typography>
                    </Box>
                    {activeForm === 'student' ? renderForm() : (
                      <Typography color="text.secondary">
                        Access your learning materials and track progress
                      </Typography>
                    )}
                  </CardContent>
                  {!activeForm && (
                    <CardActions>
                      <Button 
                        startIcon={<LoginIcon />}
                        onClick={() => setActiveForm('student')}
                        variant="contained"
                        fullWidth
                      >
                        Student Login
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>

              {/* Student Sign Up */}
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonAddIcon color="primary" sx={{ mr: 2, fontSize: 30 }} />
                      <Typography variant="h5">New Student</Typography>
                    </Box>
                    {activeForm === 'signup' ? renderForm() : (
                      <Typography color="text.secondary">
                        Join our breaking program and start your journey
                      </Typography>
                    )}
                  </CardContent>
                  {!activeForm && (
                    <CardActions>
                      <Button 
                        startIcon={<PersonAddIcon />}
                        onClick={() => setActiveForm('signup')}
                        variant="contained"
                        fullWidth
                      >
                        Sign Up
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 