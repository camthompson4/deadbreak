import { NextApiRequest, NextApiResponse } from 'next';

export function addSecurityHeaders(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
} 