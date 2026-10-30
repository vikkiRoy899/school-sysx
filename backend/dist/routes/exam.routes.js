import { Router } from 'express';
import { ExamController } from '../controllers/exam.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
const router = Router();
router.post('/', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), ExamController.createExam);
router.get('/', authenticateToken, ExamController.getExams);
router.post('/grades', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN', 'TEACHER'), ExamController.recordGrades);
router.get('/:examId/:studentId/report-card', authenticateToken, ExamController.generateReportCard);
export default router;
//# sourceMappingURL=exam.routes.js.map