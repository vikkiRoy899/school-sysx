import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';
import { ExamService } from '../services/exam.service.js';
import { createExamSchema, recordGradesSchema } from '../validators/index.js';

export class ExamController {
  static async createExam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = createExamSchema.parse(req.body);
      const result = await ExamService.createExam(req.user!.institutionId, validated);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getExams(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ExamService.getExams(req.user!.institutionId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async recordGrades(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validated = recordGradesSchema.parse(req.body);
      const result = await ExamService.recordGrades(
        validated.examId,
        req.user!.institutionId,
        validated.grades
      );
      res.json({ message: 'Grades recorded successfully', result });
    } catch (err) {
      next(err);
    }
  }

  static async generateReportCard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { examId, studentId } = req.params;
      const pdfBuffer = await ExamService.generateReportCard(
        examId,
        studentId,
        req.user!.institutionId
      );
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', `attachment; filename=report-card-${examId}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
}
