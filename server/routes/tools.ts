import { Router } from 'express';
import { getCashflow, upsertCashflow, getFinancialInsights, getLoanComparison } from '../controllers/toolsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/cashflow', getCashflow);
router.post('/cashflow', upsertCashflow);
router.get('/insights', getFinancialInsights);
router.get('/loan-comparison', getLoanComparison);

export default router;
