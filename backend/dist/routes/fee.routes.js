import { Router } from 'express';
import { FeeController } from '../controllers/fee.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
const router = Router();
router.post('/structures', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), FeeController.createFeeStructure);
router.get('/structures', authenticateToken, FeeController.getFeeStructures);
router.post('/invoices', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), FeeController.createInvoice);
router.get('/invoices', authenticateToken, FeeController.getInvoices);
router.patch('/invoices/:id/status', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), FeeController.updateInvoiceStatus);
router.get('/analytics', authenticateToken, authorizeRoles('SUPER_ADMIN', 'BRANCH_ADMIN'), FeeController.getAnalytics);
export default router;
//# sourceMappingURL=fee.routes.js.map