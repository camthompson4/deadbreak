import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../utils/firebase';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const isInitialized = !!auth;
    
    res.status(200).json({ 
      initialized: isInitialized,
      config: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Firebase initialization failed' 
    });
  }
} 