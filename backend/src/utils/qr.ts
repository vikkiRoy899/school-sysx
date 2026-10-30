import type { Buffer } from 'node:buffer';
import QRCode from 'qrcode';

export interface StudentQRData {
  admissionNumber: string;
  studentId: string;
  institutionId: string;
  fullName: string;
  className?: string;
}

export async function generateStudentQRCode(data: StudentQRData): Promise<string> {
  const payload = JSON.stringify(data);
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export async function generateQRCodeBuffer(data: StudentQRData): Promise<Buffer> {
  const payload = JSON.stringify(data);
  return await QRCode.toBuffer(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
    color: { dark: '#000000', light: '#ffffff' },
  });
}
