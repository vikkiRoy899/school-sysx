import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class ParentController {
    static getParents(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static linkStudent(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=parent.controller.d.ts.map