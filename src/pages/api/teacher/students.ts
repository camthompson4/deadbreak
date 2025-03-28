import type { NextApiRequest, NextApiResponse } from 'next';
import { CsvStorage } from '../../../utils/csvStorage';
import { verifyToken } from '../../../auth/teacherAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
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

    // Fetch all students
    const storage = new CsvStorage();
    const students = await storage.getAllStudents();

    res.status(200).json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
} 