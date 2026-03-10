import { Router } from 'express';
import { getSchemes, getScheme, getCategories } from '../controllers/schemeController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSchemes);
router.get('/categories', getCategories);
router.get('/:id', getScheme);

export default router;
