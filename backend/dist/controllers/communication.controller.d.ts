import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class CommunicationController {
    static createAnnouncement(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getAnnouncements(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static sendMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=communication.controller.d.ts.map