import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log('Testing Google Sheets connection...');
    const sheetsService = new GoogleSheetsService();
    await sheetsService.initializeDoc();
    console.log('Successfully connected to Google Sheets');
    res.status(200).json({ message: 'Google Sheets connection successful' });
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    res.status(500).json({ error: 'Failed to connect to Google Sheets' });
  }
} 