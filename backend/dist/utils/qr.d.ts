import type { Buffer } from 'node:buffer';
export interface StudentQRData {
    admissionNumber: string;
    studentId: string;
    institutionId: string;
    fullName: string;
    className?: string;
}
export declare function generateStudentQRCode(data: StudentQRData): Promise<string>;
export declare function generateQRCodeBuffer(data: StudentQRData): Promise<Buffer>;
//# sourceMappingURL=qr.d.ts.map