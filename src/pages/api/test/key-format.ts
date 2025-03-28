import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';
  
  // Safe way to show key format without exposing the actual key
  const keyCheck = {
    length: privateKey.length,
    hasHeader: privateKey.includes('-----BEGIN PRIVATE KEY-----'),
    hasFooter: privateKey.includes('-----END PRIVATE KEY-----'),
    hasQuotes: privateKey.startsWith('"') || privateKey.endsWith('"'),
    hasNewlines: privateKey.includes('\n'),
    hasEscapedNewlines: privateKey.includes('\\n'),
    firstChars: privateKey.slice(0, 30) + '...',
    lastChars: '...' + privateKey.slice(-30),
  };

  res.status(200).json({ keyCheck });
} 