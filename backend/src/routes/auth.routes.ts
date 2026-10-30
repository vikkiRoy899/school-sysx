import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/login', AuthController.login);
router.post(
  '/students/generate',
  authenticateToken,
  authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'),
  AuthController.generateStudentAccount
);
router.post('/change-password', authenticateToken, AuthController.changePassword);

export default router;
