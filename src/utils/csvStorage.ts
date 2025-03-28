import fs from 'fs/promises';
import path from 'path';

interface Student {
  name: string;
  email: string;
  progress: number;
  completionDate: Date | null;
}

interface ValidationError {
  field: string;
  message: string;
}

export class CsvStorage {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'students.csv');
  }

  private validateStudent(student: Student): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!student.name) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (student.name.length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (student.name.length > 100) {
      errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!student.email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!emailRegex.test(student.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    } else if (student.email.length > 255) {
      errors.push({ field: 'email', message: 'Email must be less than 255 characters' });
    }

    // Progress validation
    if (typeof student.progress !== 'number') {
      errors.push({ field: 'progress', message: 'Progress must be a number' });
    } else if (student.progress < 0 || student.progress > 100) {
      errors.push({ field: 'progress', message: 'Progress must be between 0 and 100' });
    }

    // Completion date validation
    if (student.completionDate !== null && !(student.completionDate instanceof Date)) {
      errors.push({ field: 'completionDate', message: 'Completion date must be a valid date or null' });
    }

    return errors;
  }

  private async checkDuplicateEmail(email: string, excludeEmail?: string): Promise<boolean> {
    const students = await this.getAllStudents();
    return students.some(s => s.email === email && s.email !== excludeEmail);
  }

  private sanitizeString(str: string): string {
    // Remove any characters that could break CSV format
    return str
      .replace(/[\r\n,]/g, ' ') // Replace newlines and commas with spaces
      .trim();
  }

  private async ensureDataDir() {
    const dir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  private formatDate(date: Date | null): string {
    return date ? date.toISOString() : '';
  }

  async addNewStudent(student: Student): Promise<void> {
    // Validate student data
    const errors = this.validateStudent(student);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
    }

    // Check for duplicate email
    if (await this.checkDuplicateEmail(student.email)) {
      throw new Error('Email already exists');
    }

    await this.ensureDataDir();
    
    // Sanitize data before saving
    const sanitizedStudent = {
      ...student,
      name: this.sanitizeString(student.name),
      email: this.sanitizeString(student.email.toLowerCase())
    };
    
    const newLine = `${sanitizedStudent.name},${sanitizedStudent.email},${sanitizedStudent.progress},${this.formatDate(sanitizedStudent.completionDate)}\n`;
    
    try {
      // Check if file exists
      try {
        await fs.access(this.filePath);
      } catch {
        // Create file with headers if it doesn't exist
        await fs.writeFile(this.filePath, 'Name,Email,Progress,CompletionDate\n');
      }
      
      // Append new student
      await fs.appendFile(this.filePath, newLine);
    } catch (error) {
      console.error('Failed to add student:', error);
      throw new Error('Failed to add student to database');
    }
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      await this.ensureDataDir();
      
      try {
        const content = await fs.readFile(this.filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Skip header row
        const students = lines.slice(1).map(line => {
          const [name, email, progress, completionDate] = line.split(',');
          return {
            name: this.sanitizeString(name),
            email: this.sanitizeString(email.toLowerCase()),
            progress: Math.min(100, Math.max(0, parseInt(progress) || 0)), // Ensure progress is between 0-100
            completionDate: completionDate ? new Date(completionDate) : null
          };
        });
        
        return students;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          // File doesn't exist yet, return empty array
          return [];
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      throw new Error('Failed to fetch students from database');
    }
  }

  async updateStudentProgress(email: string, progress: number): Promise<void> {
    // Validate progress
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      throw new Error('Progress must be a number between 0 and 100');
    }

    try {
      const students = await this.getAllStudents();
      const studentIndex = students.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
      
      if (studentIndex === -1) {
        throw new Error('Student not found');
      }

      students[studentIndex].progress = progress;
      if (progress === 100) {
        students[studentIndex].completionDate = new Date();
      }

      // Write all students back to file
      const content = 'Name,Email,Progress,CompletionDate\n' + 
        students.map(s => 
          `${this.sanitizeString(s.name)},${this.sanitizeString(s.email)},${s.progress},${this.formatDate(s.completionDate)}`
        ).join('\n') + '\n';

      await fs.writeFile(this.filePath, content);
    } catch (error) {
      console.error('Failed to update student progress:', error);
      throw new Error('Failed to update progress');
    }
  }

  // New method to find a student by email
  async findStudentByEmail(email: string): Promise<Student | null> {
    const students = await this.getAllStudents();
    return students.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
  }
} 