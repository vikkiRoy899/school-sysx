import prisma from '../prisma/client.js';
export class TeacherService {
    static async getTeachers(institutionId, branchId, role) {
        const where = { institutionId, role: 'TEACHER' };
        if (role === 'BRANCH_ADMIN' && branchId) {
            where.branchId = branchId;
        }
        return await prisma.user.findMany({
            where,
            include: {
                teacherProfile: true,
            },
        });
    }
    static async createTeacher(institutionId, branchId, data) {
        return await prisma.user.create({
            data: {
                institutionId,
                branchId,
                email: data.email,
                phone: data.phone,
                passwordHash: data.passwordHash,
                role: 'TEACHER',
                teacherProfile: {
                    create: {
                        employeeId: data.employeeId,
                        qualification: data.qualification,
                        specialization: data.specialization,
                    },
                },
            },
            include: { teacherProfile: true },
        });
    }
    static async getTeacherById(teacherId, institutionId) {
        return await prisma.user.findFirst({
            where: { id: teacherId, institutionId, role: 'TEACHER' },
            include: { teacherProfile: true },
        });
    }
    static async updateTeacher(teacherId, institutionId, data) {
        return await prisma.user.update({
            where: { id: teacherId, institutionId },
            data: {
                phone: data.phone,
                teacherProfile: {
                    update: {
                        employeeId: data.employeeId,
                        qualification: data.qualification,
                        specialization: data.specialization,
                    },
                },
            },
            include: { teacherProfile: true },
        });
    }
    static async deleteTeacher(teacherId, institutionId) {
        return await prisma.user.delete({
            where: { id: teacherId, institutionId },
        });
    }
}
//# sourceMappingURL=teacher.service.js.map