import { Router } from 'express';
import { getModules, getModule, updateProgress, getTrainingSummary } from '../controllers/trainingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getModules);
router.get('/summary', getTrainingSummary);
router.get('/:id', getModule);
router.patch('/:id/progress', updateProgress);

export default router;
