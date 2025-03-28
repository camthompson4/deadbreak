import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate: Date | null;
}

export class GoogleSheetsService {
  private doc: GoogleSpreadsheet;

  constructor() {
    // Validate environment variables
    const missingVars = [];
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) missingVars.push('GOOGLE_SHEETS_PRIVATE_KEY');
    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) missingVars.push('GOOGLE_SHEETS_CLIENT_EMAIL');
    if (!process.env.GOOGLE_SHEETS_SHEET_ID) missingVars.push('GOOGLE_SHEETS_SHEET_ID');

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Format private key
    const privateKey = this.formatPrivateKey(process.env.GOOGLE_SHEETS_PRIVATE_KEY!);

    // Create JWT client
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    this.doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SHEET_ID!, serviceAccountAuth);
  }

  private formatPrivateKey(key: string): string {
    // Remove any wrapping quotes
    let formattedKey = key.replace(/^["']|["']$/g, '');
    
    // Ensure proper line breaks
    if (!formattedKey.includes('\n')) {
      // If the key doesn't have \n characters, add them around the main content
      formattedKey = formattedKey
        .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
    }
    
    // Replace literal \n with actual line breaks
    formattedKey = formattedKey.replace(/\\n/g, '\n');
    
    return formattedKey;
  }

  private async initializeDoc() {
    try {
      console.log('Loading document info...');
      await this.doc.loadInfo();
      console.log('Document loaded:', {
        title: this.doc.title,
        sheetCount: this.doc.sheetCount
      });
      return true;
    } catch (error) {
      console.error('Google Sheets initialization error:', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n')
        } : error
      });
      throw error;
    }
  }

  async addNewStudent(student: Student) {
    try {
      await this.initializeDoc();
      
      const sheet = this.doc.sheetsByIndex[0];
      if (!sheet) {
        throw new Error('No sheet found in the document');
      }

      console.log('Adding student to sheet:', {
        sheetTitle: sheet.title,
        rowCount: sheet.rowCount,
        student: {
          ...student,
          completionDate: student.completionDate?.toISOString()
        }
      });

      await sheet.addRow({
        Name: student.name,
        Email: student.email,
        Progress: student.progress.toString(),
        'Completion Date': student.completionDate ? student.completionDate.toISOString() : ''
      });

      console.log('Student added successfully');
    } catch (error) {
      console.error('Failed to add student:', error);
      throw error;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      await this.initializeDoc();
      
      const sheet = this.doc.sheetsByIndex[0];
      if (!sheet) {
        throw new Error('No sheet found');
      }

      const rows = await sheet.getRows();
      
      return rows.map(row => ({
        name: row.Name,
        email: row.Email,
        progress: parseInt(row.Progress) || 0,
        completionDate: row['Completion Date'] ? new Date(row['Completion Date']) : null
      }));
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw new Error('Failed to fetch students from database');
    }
  }

  async updateStudentProgress(email: string, progress: number): Promise<void> {
    try {
      await this.initializeDoc();
      
      const sheet = this.doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      
      const studentRow = rows.find(row => row.Email === email);
      if (!studentRow) {
        throw new Error('Student not found');
      }

      studentRow.Progress = progress;
      if (progress === 100) {
        studentRow['Completion Date'] = new Date().toISOString();
      }
      
      await studentRow.save();
    } catch (error) {
      console.error('Failed to update student progress:', error);
      throw new Error('Failed to update progress');
    }
  }
} 