import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsService } from '../../../utils/googleSheets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sheetsService = new GoogleSheetsService();
    const students = await sheetsService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
} 