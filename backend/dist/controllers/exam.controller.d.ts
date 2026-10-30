import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class ExamController {
    static createExam(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getExams(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static recordGrades(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static generateReportCard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=exam.controller.d.ts.map