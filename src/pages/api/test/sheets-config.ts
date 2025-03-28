import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  
  // Check if private key exists and is properly formatted
  const privateKeyCheck = {
    exists: !!privateKey,
    hasHeader: privateKey?.includes('-----BEGIN PRIVATE KEY-----'),
    hasFooter: privateKey?.includes('-----END PRIVATE KEY-----'),
    containsNewlines: privateKey?.includes('\\n'),
    length: privateKey?.length
  };

  res.status(200).json({
    config: {
      hasPrivateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasClientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasSheetId: !!process.env.GOOGLE_SHEETS_SHEET_ID,
    },
    privateKeyCheck,
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    sheetId: process.env.GOOGLE_SHEETS_SHEET_ID
  });
} 