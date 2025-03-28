import type { NextApiRequest, NextApiResponse } from 'next';
import { createTeacherToken } from '../../../auth/teacherAuth';

// In a real app, you'd want to store these securely
const ALLOWED_TEACHERS = new Set([
  'teacher@deadbreak.edu'
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, uid } = req.body;

    if (!email || !uid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify teacher email
    if (!ALLOWED_TEACHERS.has(email)) {
      return res.status(403).json({ error: 'Not authorized as teacher' });
    }

    // Create teacher token
    const token = await createTeacherToken(email, uid);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
} 