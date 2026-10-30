import { Buffer } from 'node:buffer';
export interface ReportCardPDFData {
    institutionName: string;
    studentName: string;
    admissionNumber: string;
    rollNumber?: string;
    className: string;
    examTitle: string;
    grades: Array<{
        subject: string;
        marks: number;
        totalMarks: number;
        remarks?: string;
    }>;
}
export declare function generateReportCardPDF(data: ReportCardPDFData): Promise<Buffer>;
//# sourceMappingURL=pdf.d.ts.map