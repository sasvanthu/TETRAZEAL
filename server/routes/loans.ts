import { Router } from 'express';
import {
  getLoans, getLoan, createLoan, updateLoan, deleteLoan,
  markEMIPaid, calculateEMIPreview
} from '../controllers/loanController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getLoans);
router.post('/', createLoan);
router.get('/calculate', calculateEMIPreview);
router.get('/:id', getLoan);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);
router.patch('/emi/:emiId/pay', markEMIPaid);

export default router;
