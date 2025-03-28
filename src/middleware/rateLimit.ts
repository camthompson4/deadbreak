import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registration attempts per window
  message: { error: 'Too many registration attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export function applyRateLimit(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    rateLimiter(req, res, (result: Error | unknown) => {
      if (result instanceof Error) reject(result);
      resolve(result);
    });
  });
} 