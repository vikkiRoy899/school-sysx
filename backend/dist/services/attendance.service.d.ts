export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export declare class AttendanceService {
    static markAttendance(institutionId: string, branchId: string, data: {
        classId: string;
        date: string;
        subject?: string;
        records: Array<{
            studentId: string;
            status: AttendanceStatus;
            remarks?: string;
        }>;
    }): Promise<any>;
    static getAttendanceByClass(classId: string, date: string, institutionId: string): Promise<any>;
    static getStudentAttendance(studentId: string, institutionId: string): Promise<any>;
}
//# sourceMappingURL=attendance.service.d.ts.map