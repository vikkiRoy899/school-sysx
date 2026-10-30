import prisma from '../prisma/client.js';
export class ParentService {
    static async getParents(institutionId) {
        return await prisma.user.findMany({
            where: { institutionId, role: 'PARENT' },
            include: {
                parentProfile: {
                    include: {
                        students: {
                            include: { user: true, class: true },
                        },
                    },
                },
            },
        });
    }
    static async linkStudentToParent(parentUserId, studentProfileId, institutionId) {
        const parentUser = await prisma.user.findFirst({
            where: { id: parentUserId, institutionId, role: 'PARENT' },
            include: { parentProfile: true },
        });
        if (!parentUser || !parentUser.parentProfile) {
            throw new Error('Parent user not found');
        }
        return await prisma.studentProfile.update({
            where: { id: studentProfileId },
            data: {
                guardianId: parentUser.parentProfile.id,
            },
        });
    }
}
//# sourceMappingURL=parent.service.js.map