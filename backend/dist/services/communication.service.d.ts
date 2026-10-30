export type Role = 'SUPER_ADMIN' | 'BRANCH_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
export declare class CommunicationService {
    static createAnnouncement(institutionId: string, creatorId: string, data: {
        title: string;
        content: string;
        targetRole?: Role;
    }): Promise<any>;
    static getAnnouncements(institutionId: string, userRole?: Role): Promise<any>;
    static sendMessage(senderId: string, receiverId: string, content: string): Promise<any>;
    static getMessagesBetweenUsers(userId1: string, userId2: string): Promise<any>;
}
//# sourceMappingURL=communication.service.d.ts.map