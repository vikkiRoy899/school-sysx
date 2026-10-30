import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class AttendanceController {
    static markAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getAttendanceByClass(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getStudentAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=attendance.controller.d.ts.map