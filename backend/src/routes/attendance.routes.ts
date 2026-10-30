import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post(
  '/mark',
  authenticateToken,
  authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN', 'TEACHER'),
  AttendanceController.markAttendance
);
router.get('/class', authenticateToken, AttendanceController.getAttendanceByClass);
router.get('/student/:studentId?', authenticateToken, AttendanceController.getStudentAttendance);

export default router;
