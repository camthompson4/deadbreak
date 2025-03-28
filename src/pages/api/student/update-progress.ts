import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../auth/authContext';
import { CsvStorage } from '../../../utils/csvStorage';
import { Cache } from '../../../utils/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
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

    const { lessonId, completed } = req.body;
    if (typeof lessonId !== 'string' || typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Get student data
    const storage = new CsvStorage();
    const student = await storage.findStudentByEmail(decoded.email);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate new progress
    const totalLessons = 4; // This should match the number of lessons in lessons.ts
    const lessonNumber = parseInt(lessonId);
    let newProgress = student.progress;

    if (completed) {
      newProgress = Math.max(newProgress, (lessonNumber / totalLessons) * 100);
    }

    // Update progress
    await storage.updateStudentProgress(decoded.email, newProgress);

    // Invalidate relevant caches
    const cache = Cache.getInstance();
    cache.invalidatePattern(new RegExp(`^student:${decoded.email}:`));

    res.status(200).json({ progress: newProgress });
  } catch (error) {
    console.error('Failed to update progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
} 