import prisma from '../prisma/client.js';
export class StudentService {
    static async getStudents(institutionId, branchId, role) {
        const where = { institutionId };
        if (role === 'BRANCH_ADMIN' && branchId) {
            where.branchId = branchId;
        }
        return await prisma.user.findMany({
            where: { ...where, role: 'STUDENT' },
            include: {
                studentProfile: {
                    include: {
                        class: true,
                        guardian: true,
                    },
                },
            },
        });
    }
    static async createStudent(institutionId, branchId, data) {
        return await prisma.user.create({
            data: {
                institutionId,
                branchId,
                email: data.email,
                phone: data.phone,
                passwordHash: data.passwordHash,
                role: 'STUDENT',
                studentProfile: {
                    create: {
                        admissionNumber: data.admissionNumber,
                        rollNumber: data.rollNumber,
                        classId: data.classId,
                        otPasswordTemp: data.otPasswordTemp,
                    },
                },
            },
            include: { studentProfile: true },
        });
    }
    static async getStudentById(studentId, institutionId) {
        const user = await prisma.user.findFirst({
            where: { id: studentId, institutionId, role: 'STUDENT' },
            include: {
                studentProfile: {
                    include: {
                        class: true,
                        guardian: true,
                        attendance: true,
                        grades: { include: { exam: true } },
                        invoices: { include: { feeStructure: true } },
                    },
                },
            },
        });
        return user;
    }
    static async updateStudent(studentId, institutionId, data) {
        const user = await prisma.user.update({
            where: { id: studentId, institutionId },
            data: {
                phone: data.phone,
                studentProfile: {
                    update: {
                        rollNumber: data.rollNumber,
                        classId: data.classId,
                    },
                },
            },
            include: { studentProfile: true },
        });
        return user;
    }
    static async deleteStudent(studentId, institutionId) {
        return await prisma.user.delete({
            where: { id: studentId, institutionId },
        });
    }
    static async generateQRData(student) {
        return {
            admissionNumber: student.studentProfile.admissionNumber,
            studentId: student.id,
            institutionId: student.institutionId,
            fullName: student.email, // or actual name if added
            className: student.studentProfile.class?.name,
        };
    }
}
//# sourceMappingURL=student.service.js.map