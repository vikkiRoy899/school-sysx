import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { CommunicationService } from '../services/communication.service.js';
import { createAnnouncementSchema, sendMessageSchema } from '../validators/index.js';

export class CommunicationController {
  static async createAnnouncement(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createAnnouncementSchema.parse(req.body);
      const result = await CommunicationService.createAnnouncement(
        req.user!.institutionId,
        req.user!.userId,
        {
          title: validated.title,
          content: validated.content,
          targetRole: validated.targetRole,
        }
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getAnnouncements(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const announcements = await CommunicationService.getAnnouncements(
        req.user!.institutionId,
        req.user!.role as any
      );
      res.json(announcements);
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = sendMessageSchema.parse(req.body);
      const result = await CommunicationService.sendMessage(
        req.user!.userId,
        validated.receiverId,
        validated.content
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { otherUserId } = req.params;
      const messages = await CommunicationService.getMessagesBetweenUsers(
        req.user!.userId,
        otherUserId
      );
      res.json(messages);
    } catch (err) {
      next(err);
    }
  }
}
