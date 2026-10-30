import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { ParentService } from '../services/parent.service.js';

export class ParentController {
  static async getParents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parents = await ParentService.getParents(req.user!.institutionId);
      res.json(parents);
    } catch (err) {
      next(err);
    }
  }

  static async linkStudent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { parentUserId, studentProfileId } = req.body;
      const result = await ParentService.linkStudentToParent(
        parentUserId,
        studentProfileId,
        req.user!.institutionId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
