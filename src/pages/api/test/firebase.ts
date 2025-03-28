import type { NextApiRequest, NextApiResponse } from 'next';
import { app } from '../../../utils/firebase';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Firebase Config:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
    
    res.status(200).json({ 
      initialized: !!app,
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
  } catch (error) {
    console.error('Firebase test failed:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Firebase test failed' });
  }
} 