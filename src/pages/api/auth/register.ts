import type { NextApiRequest, NextApiResponse } from 'next';
import { signUp } from '../../../utils/auth';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;
    
    // Create Firebase account
    const auth = await signUp(email, password);
    
    // Add to Google Sheets
    const sheetsService = new GoogleSheetsService();
    await sheetsService.addNewStudent({ name, email });

    res.status(200).json(auth);
  } catch (error) {
    res.status(400).json({ error: 'Failed to register' });
  }
} 