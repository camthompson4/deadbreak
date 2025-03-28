import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../auth/authContext';
import { CsvStorage } from '../../../utils/csvStorage';
import { Cache } from '../../../utils/cache';

// In a real app, this would come from a database
const LESSONS = [
  {
    id: '1',
    title: 'Introduction to Dead Break',
    description: 'Learn the fundamentals of the Dead Break technique',
    duration: '15 minutes',
    isLocked: false
  },
  {
    id: '2',
    title: 'Basic Positioning',
    description: 'Master the correct stance and positioning',
    duration: '20 minutes',
    isLocked: false
  },
  {
    id: '3',
    title: 'Advanced Techniques',
    description: 'Learn advanced Dead Break variations',
    duration: '30 minutes',
    isLocked: true
  },
  {
    id: '4',
    title: 'Practice Drills',
    description: 'Essential drills to improve your Dead Break',
    duration: '25 minutes',
    isLocked: true
  }
];

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

    // Check cache first
    const cache = Cache.getInstance();
    const cacheKey = `student:${decoded.email}:lessons`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Get student progress to determine completed lessons
    const storage = new CsvStorage();
    const student = await storage.findStudentByEmail(decoded.email);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate which lessons are completed based on progress
    const progress = student.progress;
    const lessonsWithStatus = LESSONS.map((lesson, index) => ({
      ...lesson,
      isCompleted: progress >= ((index + 1) / LESSONS.length) * 100,
      // Unlock next lesson if previous is completed
      isLocked: index > 0 ? progress < (index / LESSONS.length) * 100 : false
    }));

    // Cache the result
    cache.set(cacheKey, lessonsWithStatus);

    res.status(200).json(lessonsWithStatus);
  } catch (error) {
    console.error('Failed to fetch lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
} 