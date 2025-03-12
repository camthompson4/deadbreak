import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate?: Date | null;
}

export class GoogleSheetsService {
  private auth: GoogleAuth;
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    this.auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID || '';
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A2:D', // Assuming headers are in row 1
      });

      const rows = response.data.values || [];
      return rows.map((row: any[]) => ({
        name: row[0] || '',
        email: row[1] || '',
        progress: parseInt(row[2] || '0'),
        completionDate: row[3] ? new Date(row[3]) : null,
      }));
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw new Error('Failed to fetch students');
    }
  }

  async updateStudentProgress(email: string, progress: number): Promise<void> {
    try {
      // First, find the student's row
      const students = await this.getAllStudents();
      const rowIndex = students.findIndex((s: Student) => s.email === email) + 2; // +2 for header row and 0-based index

      if (rowIndex < 2) {
        throw new Error('Student not found');
      }

      // Update the progress
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Sheet1!C${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[progress]]
        }
      });

      // If progress is 100%, update completion date
      if (progress === 100) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `Sheet1!D${rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[new Date().toISOString()]]
          }
        });
      }
    } catch (error) {
      console.error('Error updating Google Sheets:', error);
      throw error;
    }
  }

  async addNewStudent({ name, email }: { name: string; email: string }): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A2:D2',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[name, email, '0', '']], // Initial progress 0%, no completion date
        },
      });
    } catch (error) {
      console.error('Failed to add student:', error);
      throw new Error('Failed to add student');
    }
  }
} 