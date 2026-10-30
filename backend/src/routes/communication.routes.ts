import { Router } from 'express';
import { CommunicationController } from '../controllers/communication.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post(
  '/announcements',
  authenticateToken,
  authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN', 'TEACHER'),
  CommunicationController.createAnnouncement
);
router.get('/announcements', authenticateToken, CommunicationController.getAnnouncements);
router.post('/messages', authenticateToken, CommunicationController.sendMessage);
router.get('/messages/:otherUserId', authenticateToken, CommunicationController.getMessages);

export default router;
