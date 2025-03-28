import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Starting debug test...');

    // 1. Check environment variables
    const envCheck = {
      privateKey: {
        exists: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
        length: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.length,
        startsWithHeader: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.startsWith('-----BEGIN PRIVATE KEY-----'),
        endsWithFooter: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.endsWith('-----END PRIVATE KEY-----'),
      },
      clientEmail: {
        exists: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        value: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      sheetId: {
        exists: !!process.env.GOOGLE_SHEETS_SHEET_ID,
        value: process.env.GOOGLE_SHEETS_SHEET_ID,
      }
    };
    console.log('Environment check:', envCheck);

    // 2. Format private key
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY!
      .replace(/\\n/g, '\n')
      .replace(/"$/, '')
      .replace(/^"/, '');

    // 3. Create JWT client
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 4. Initialize document
    console.log('Initializing document...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SHEET_ID!, serviceAccountAuth);

    // 5. Load document info
    console.log('Loading document info...');
    await doc.loadInfo();

    res.status(200).json({
      success: true,
      documentInfo: {
        title: doc.title,
        sheetCount: doc.sheetCount
      },
      envCheck
    });
  } catch (error) {
    console.error('Debug test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      envCheck: {
        privateKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
        clientEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        sheetId: !!process.env.GOOGLE_SHEETS_SHEET_ID
      }
    });
  }
} 