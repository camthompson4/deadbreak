import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { TeacherDashboard } from '../components/TeacherDashboard';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'teacher') return null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Dead Break Education
      </Typography>
      <TeacherDashboard />
    </Container>
  );
} 