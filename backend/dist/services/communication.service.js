import prisma from '../prisma/client.js';
export class CommunicationService {
    static async createAnnouncement(institutionId, creatorId, data) {
        return await prisma.announcement.create({
            data: {
                institutionId,
                creatorId,
                title: data.title,
                content: data.content,
                targetRole: data.targetRole,
            },
        });
    }
    static async getAnnouncements(institutionId, userRole) {
        const where = { institutionId };
        if (userRole) {
            where.OR = [{ targetRole: userRole }, { targetRole: null }];
        }
        return await prisma.announcement.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    static async sendMessage(senderId, receiverId, content) {
        return await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
    }
    static async getMessagesBetweenUsers(userId1, userId2) {
        return await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
    }
}
//# sourceMappingURL=communication.service.js.map