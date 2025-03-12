import QRCode from 'qrcode';

interface BusinessCard {
  studentName: string;
  completionDate: Date;
  courseId: string;
  uniqueIdentifier: string;
}

class QRCodeGenerator {
  async generateStudentQR(cardInfo: BusinessCard): Promise<string> {
    const qrData = JSON.stringify({
      id: cardInfo.uniqueIdentifier,
      student: cardInfo.studentName,
      course: cardInfo.courseId,
      completed: cardInfo.completionDate.toISOString()
    });
    
    const qrCodeData = await QRCode.toDataURL(qrData);
    return qrCodeData;
  }
}

export default QRCodeGenerator; 