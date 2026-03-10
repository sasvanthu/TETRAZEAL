import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { chat as aiChat, getFinancialSummary } from '../controllers/aiController.js';

const router = Router();
router.use(authenticate);

router.post('/chat', aiChat);
router.get('/summary', getFinancialSummary);

export default router;

