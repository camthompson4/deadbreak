import { GoogleSheetsService } from '../utils/googleSheets';

async function testGoogleSheets() {
  try {
    const sheetsService = new GoogleSheetsService();
    
    // Test adding a new student
    await sheetsService.addNewStudent({
      name: 'Test Student',
      email: 'test@example.com'
    });
    console.log('Added new student successfully');

    // Test reading all students
    const students = await sheetsService.getAllStudents();
    console.log('Current students:', students);

    // Test updating student progress
    await sheetsService.updateStudentProgress('test@example.com', 50);
    console.log('Updated student progress successfully');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testGoogleSheets(); 