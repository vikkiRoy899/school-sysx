export declare class ExamService {
    static createExam(institutionId: string, data: any): Promise<any>;
    static getExams(institutionId: string): Promise<any>;
    static recordGrades(examId: string, institutionId: string, grades: any[]): Promise<any>;
    static generateReportCard(examId: string, studentId: string, institutionId: string): Promise<Buffer<ArrayBufferLike>>;
}
//# sourceMappingURL=exam.service.d.ts.map