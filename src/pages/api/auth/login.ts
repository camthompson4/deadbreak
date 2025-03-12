import type { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const auth = await signIn(email, password);
    res.status(200).json(auth);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
} 