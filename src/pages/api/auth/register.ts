import type { NextApiRequest, NextApiResponse } from 'next';
import { CsvStorage } from '../../../utils/csvStorage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting registration process...');
    const { email, name, uid } = req.body;
    
    if (!email || !name || !uid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add to CSV storage
    const storage = new CsvStorage();
    try {
      await storage.addNewStudent({
        name,
        email,
        progress: 0,
        completionDate: null
      });
    } catch (error) {
      if (error.message.includes('Validation failed:')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      throw error;
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        email,
        role: 'student',
        uid 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
} 