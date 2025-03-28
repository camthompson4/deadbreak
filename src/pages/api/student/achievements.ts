import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../auth/authContext';
import { CsvStorage } from '../../../utils/csvStorage';
import { Cache } from '../../../utils/cache';

// In a real app, this would come from a database
const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'baby',
    progressRequired: 25
  },
  {
    id: '2',
    title: 'Half Way There',
    description: 'Complete 50% of the course',
    icon: 'halfway',
    progressRequired: 50
  },
  {
    id: '3',
    title: 'Almost There',
    description: 'Complete 75% of the course',
    icon: 'running',
    progressRequired: 75
  },
  {
    id: '4',
    title: 'Dead Break Master',
    description: 'Complete the entire course',
    icon: 'trophy',
    progressRequired: 100
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
    const cacheKey = `student:${decoded.email}:achievements`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // Get student progress to determine unlocked achievements
    const storage = new CsvStorage();
    const student = await storage.findStudentByEmail(decoded.email);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate which achievements are unlocked based on progress
    const achievementsWithStatus = ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      isUnlocked: student.progress >= achievement.progressRequired
    }));

    // Cache the result
    cache.set(cacheKey, achievementsWithStatus);

    res.status(200).json(achievementsWithStatus);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
} 