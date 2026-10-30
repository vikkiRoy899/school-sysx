export declare class AuthService {
    static login(email: string, pass: string): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            phone: any;
            role: any;
            institutionId: any;
            institutionName: any;
            mustChangePassword: any;
            profile: any;
        };
    }>;
    static generateStudentAccount(institutionId: string, branchId: string | null, data: {
        email: string;
        phone?: string;
        admissionNumber: string;
        rollNumber?: string;
        classId?: string;
    }): Promise<{
        userId: any;
        email: any;
        otpSecret: string;
        tempPassword: string;
        admissionNumber: any;
    }>;
    static changePassword(userId: string, currentPass: string, newPass: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map