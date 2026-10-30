export declare class TeacherService {
    static getTeachers(institutionId: string, branchId: string | null, role: string): Promise<any>;
    static createTeacher(institutionId: string, branchId: string, data: any): Promise<any>;
    static getTeacherById(teacherId: string, institutionId: string): Promise<any>;
    static updateTeacher(teacherId: string, institutionId: string, data: any): Promise<any>;
    static deleteTeacher(teacherId: string, institutionId: string): Promise<any>;
}
//# sourceMappingURL=teacher.service.d.ts.map