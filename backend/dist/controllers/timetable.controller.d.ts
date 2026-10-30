import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class TimetableController {
    static createSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getTimetableByClass(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getTimetableByTeacher(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=timetable.controller.d.ts.map