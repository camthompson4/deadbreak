import type { NextApiRequest, NextApiResponse } from 'next';

// In a real app, these would be stored securely in a database
const VALID_REGISTRATION_CODES = new Set([
  'TEACHER2024',  // Example code
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Registration code is required' });
    }

    if (!VALID_REGISTRATION_CODES.has(code)) {
      return res.status(403).json({ error: 'Invalid registration code' });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Code verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
} 