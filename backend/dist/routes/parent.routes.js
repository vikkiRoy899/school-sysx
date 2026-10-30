import { Router } from 'express';
import { ParentController } from '../controllers/parent.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
const router = Router();
router.get('/', authenticateToken, ParentController.getParents);
router.post('/link-student', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), ParentController.linkStudent);
export default router;
//# sourceMappingURL=parent.routes.js.map