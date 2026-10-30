import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
export declare class FeeController {
    static createFeeStructure(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getFeeStructures(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static createInvoice(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getInvoices(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static updateInvoiceStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    static getAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=fee.controller.d.ts.map