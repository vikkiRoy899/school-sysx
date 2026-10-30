import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { FeeService } from '../services/fee.service.js';
import { createFeeStructureSchema } from '../validators/index.js';

export class FeeController {
  static async createFeeStructure(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createFeeStructureSchema.parse(req.body);
      const result = await FeeService.createFeeStructure(req.user!.institutionId, validated);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getFeeStructures(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await FeeService.getFeeStructures(req.user!.institutionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async createInvoice(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, feeStructureId } = req.body;
      const result = await FeeService.createInvoice(studentId, feeStructureId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getInvoices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.query.studentId as string | undefined;
      const result = await FeeService.getInvoices(req.user!.institutionId, studentId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async updateInvoiceStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const result = await FeeService.updateInvoiceStatus(req.params.id, status);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const analytics = await FeeService.getRevenueAnalytics(req.user!.institutionId);
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  }
}
