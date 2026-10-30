import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class AuthController {
    static login(req: Request, res: Response, next: NextFunction): Promise<void>;
    static generateStudentAccount(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map