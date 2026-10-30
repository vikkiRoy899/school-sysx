import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { TimetableService } from '../services/timetable.service.js';
import { createTimetableSchema } from '../validators/index.js';

export class TimetableController {
  static async createSchedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createTimetableSchema.parse(req.body);
      const result = await TimetableService.createSchedule(validated);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getTimetableByClass(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { classId } = req.params;
      const timetable = await TimetableService.getTimetableByClass(classId);
      res.json(timetable);
    } catch (err) {
      next(err);
    }
  }

  static async getTimetableByTeacher(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { teacherId } = req.params;
      const timetable = await TimetableService.getTimetableByTeacher(teacherId);
      res.json(timetable);
    } catch (err) {
      next(err);
    }
  }
}
