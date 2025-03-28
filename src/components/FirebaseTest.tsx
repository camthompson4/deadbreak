import { useEffect, useState } from 'react';
import { auth } from '../utils/firebaseClient';
import { Alert, Box } from '@mui/material';

export default function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      if (auth) {
        console.log('Firebase Auth initialized:', auth);
        setStatus('success');
      } else {
        setStatus('error');
        setError('Firebase Auth not initialized');
      }
    } catch (err) {
      console.error('Firebase init error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Firebase initialization failed');
    }
  }, []);

  if (status === 'loading') return null;

  return (
    <Box position="fixed" bottom={16} right={16} zIndex={9999}>
      <Alert severity={status === 'success' ? 'success' : 'error'}>
        {status === 'success' ? 'Firebase Ready' : error}
      </Alert>
    </Box>
  );
} 