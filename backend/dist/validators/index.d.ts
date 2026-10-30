import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createStudentSchema: z.ZodObject<{
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    admissionNumber: z.ZodString;
    rollNumber: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    admissionNumber: string;
    branchId?: string | undefined;
    phone?: string | undefined;
    rollNumber?: string | undefined;
    classId?: string | undefined;
}, {
    email: string;
    admissionNumber: string;
    branchId?: string | undefined;
    phone?: string | undefined;
    rollNumber?: string | undefined;
    classId?: string | undefined;
}>;
export declare const updatePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const markAttendanceSchema: z.ZodObject<{
    classId: z.ZodString;
    date: z.ZodEffects<z.ZodString, string, string>;
    subject: z.ZodOptional<z.ZodString>;
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        status: z.ZodEnum<["PRESENT", "ABSENT", "LATE", "EXCUSED"]>;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        studentId: string;
        remarks?: string | undefined;
    }, {
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        studentId: string;
        remarks?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    classId: string;
    date: string;
    records: {
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        studentId: string;
        remarks?: string | undefined;
    }[];
    subject?: string | undefined;
}, {
    classId: string;
    date: string;
    records: {
        status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
        studentId: string;
        remarks?: string | undefined;
    }[];
    subject?: string | undefined;
}>;
export declare const createFeeStructureSchema: z.ZodObject<{
    name: z.ZodString;
    amount: z.ZodNumber;
    dueDate: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    name: string;
    amount: number;
    dueDate: string;
}, {
    name: string;
    amount: number;
    dueDate: string;
}>;
export declare const createExamSchema: z.ZodObject<{
    title: z.ZodString;
    subject: z.ZodString;
    date: z.ZodEffects<z.ZodString, string, string>;
    totalMarks: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    date: string;
    subject: string;
    title: string;
    totalMarks: number;
}, {
    date: string;
    subject: string;
    title: string;
    totalMarks: number;
}>;
export declare const recordGradesSchema: z.ZodObject<{
    examId: z.ZodString;
    grades: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        marks: z.ZodNumber;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        marks: number;
        remarks?: string | undefined;
    }, {
        studentId: string;
        marks: number;
        remarks?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    examId: string;
    grades: {
        studentId: string;
        marks: number;
        remarks?: string | undefined;
    }[];
}, {
    examId: string;
    grades: {
        studentId: string;
        marks: number;
        remarks?: string | undefined;
    }[];
}>;
export declare const createTimetableSchema: z.ZodObject<{
    classId: z.ZodString;
    teacherId: z.ZodString;
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
    subject: z.ZodString;
    room: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    classId: string;
    subject: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string | undefined;
}, {
    classId: string;
    subject: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string | undefined;
}>;
export declare const createAnnouncementSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    targetRole: z.ZodOptional<z.ZodEnum<["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER", "PARENT", "STUDENT"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    targetRole?: "STUDENT" | "SUPER_ADMIN" | "BRANCH_ADMIN" | "TEACHER" | "PARENT" | undefined;
}, {
    title: string;
    content: string;
    targetRole?: "STUDENT" | "SUPER_ADMIN" | "BRANCH_ADMIN" | "TEACHER" | "PARENT" | undefined;
}>;
export declare const sendMessageSchema: z.ZodObject<{
    receiverId: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    receiverId: string;
}, {
    content: string;
    receiverId: string;
}>;
//# sourceMappingURL=index.d.ts.map