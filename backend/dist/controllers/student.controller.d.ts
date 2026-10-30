import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class StudentController {
    static getStudents(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getStudentById(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getStudentIDCard(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=student.controller.d.ts.map