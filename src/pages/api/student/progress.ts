import type { NextApiRequest, NextApiResponse } from 'next';
import { CsvStorage } from '../../../utils/csvStorage';
import { verifyToken } from '../../../auth/authContext';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify student authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = await verifyToken(token);
    if (!decoded.email) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get student progress from storage
    const storage = new CsvStorage();
    const student = await storage.findStudentByEmail(decoded.email);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ progress: student.progress });
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
} 