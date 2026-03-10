import { Router } from 'express';
import { getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;
