import prisma from '../prisma/client.js';
export type Role = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export class CommunicationService {
  static async createAnnouncement(
    institutionId: string,
    creatorId: string,
    data: { title: string; content: string; targetRole?: Role }
  ) {
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

  static async getAnnouncements(institutionId: string, userRole?: Role) {
    const where: any = { institutionId };
    if (userRole) {
      where.OR = [{ targetRole: userRole }, { targetRole: null }];
    }
    return await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async sendMessage(senderId: string, receiverId: string, content: string) {
    return await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }

  static async getMessagesBetweenUsers(userId1: string, userId2: string) {
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
