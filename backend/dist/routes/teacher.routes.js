import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticateToken, TeacherController.getTeachers);
router.get('/:id', authenticateToken, TeacherController.getTeacherById);
export default router;
//# sourceMappingURL=teacher.routes.js.map