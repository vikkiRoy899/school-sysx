import { StudentQRData } from '../utils/qr.js';
export declare class StudentService {
    static getStudents(institutionId: string, branchId: string | null, role: string): Promise<any>;
    static createStudent(institutionId: string, branchId: string, data: any): Promise<any>;
    static getStudentById(studentId: string, institutionId: string): Promise<any>;
    static updateStudent(studentId: string, institutionId: string, data: any): Promise<any>;
    static deleteStudent(studentId: string, institutionId: string): Promise<any>;
    static generateQRData(student: any): Promise<StudentQRData>;
}
//# sourceMappingURL=student.service.d.ts.map