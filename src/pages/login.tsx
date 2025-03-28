import React, { useState, Suspense } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { StudentRegistrationForm } from '../components/StudentRegistrationForm';
import { LoadingPage } from '../components/LoadingPage';

export default function LoginPage() {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTeacherLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      await login(email, password, 'teacher');
      router.push('/teacher-dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentRegistration = async (data: StudentRegistrationData) => {
    try {
      setLoading(true);
      setError('');
      await register(data);
      router.push('/student-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tab} 
            onChange={(_, newValue) => setTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                color: 'white',
                '&.Mui-selected': {
                  color: '#ff1a1a',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ff1a1a',
              },
            }}
          >
            <Tab label="Student Registration" />
            <Tab label="Teacher Login" />
          </Tabs>
        </Box>
        
        {tab === 0 ? (
          <StudentRegistrationForm 
            onSubmit={handleStudentRegistration}
            loading={loading}
            error={error}
          />
        ) : (
          <LoginForm 
            onSubmit={handleTeacherLogin}
            loading={loading}
            error={error}
          />
        )}
      </Container>
    </Suspense>
  );
} 