import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class TeacherController {
    static getTeachers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getTeacherById(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=teacher.controller.d.ts.map