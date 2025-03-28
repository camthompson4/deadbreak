import type { NextApiRequest, NextApiResponse } from 'next';
import { CsvStorage } from '../../../utils/csvStorage';
import { verifyToken } from '../../../auth/teacherAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify teacher authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = await verifyToken(token);
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { email, progress } = req.body;

    if (!email || typeof progress !== 'number') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Update student progress
    const storage = new CsvStorage();
    await storage.updateStudentProgress(email, progress);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to update progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
} 