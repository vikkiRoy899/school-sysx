import { Router } from 'express';
import { TimetableController } from '../controllers/timetable.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
const router = Router();
router.post('/', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), TimetableController.createSchedule);
router.get('/class/:classId', authenticateToken, TimetableController.getTimetableByClass);
router.get('/teacher/:teacherId', authenticateToken, TimetableController.getTimetableByTeacher);
export default router;
//# sourceMappingURL=timetable.routes.js.map