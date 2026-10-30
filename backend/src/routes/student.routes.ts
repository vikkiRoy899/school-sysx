import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, StudentController.getStudents);
router.get('/:id', authenticateToken, StudentController.getStudentById);
router.get('/:id/id-card', authenticateToken, StudentController.getStudentIDCard);

export default router;
