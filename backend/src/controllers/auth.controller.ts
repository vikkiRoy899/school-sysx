import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { loginSchema, updatePasswordSchema } from '../validators/index.js';
import { AuthRequest } from '../types/index.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.email, validated.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async generateStudentAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, phone, admissionNumber, rollNumber, classId, branchId } = req.body;
      const result = await AuthService.generateStudentAccount(
        req.user!.institutionId,
        branchId || req.user!.branchId,
        { email, phone, admissionNumber, rollNumber, classId }
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = updatePasswordSchema.parse(req.body);
      await AuthService.changePassword(req.user!.userId, validated.currentPassword, validated.newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}
