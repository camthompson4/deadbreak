import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tests = {
    sheets: false,
    jwt: false
  };
  const errors: Record<string, string> = {};

  try {
    // Test Google Sheets
    const sheetsService = new GoogleSheetsService();
    await sheetsService.addNewStudent({
      name: 'Test Student',
      email: 'test@example.com',
      progress: 0,
      completionDate: null
    });
    tests.sheets = true;
  } catch (error) {
    errors.sheets = error instanceof Error ? error.message : 'Sheets test failed';
  }

  // Test JWT
  try {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ test: true }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    jwt.verify(token, process.env.JWT_SECRET!);
    tests.jwt = true;
  } catch (error) {
    errors.jwt = error instanceof Error ? error.message : 'JWT test failed';
  }

  res.status(200).json({
    tests,
    errors,
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSheetsKey: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      hasSheetsEmail: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      hasSheetsId: !!process.env.GOOGLE_SHEETS_SHEET_ID
    }
  });
} 