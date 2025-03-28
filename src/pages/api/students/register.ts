import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, phoneNumber, ssnLast4, optInAlerts, uid } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !ssnLast4 || !uid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add student to Google Sheets
    const sheetsService = new GoogleSheetsService();
    await sheetsService.addNewStudent({
      name: fullName,
      email,
      progress: 0,
      completionDate: null,
      phoneNumber,
      ssnLast4,
      optInAlerts,
      uid
    });

    res.status(200).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register student' });
  }
} 