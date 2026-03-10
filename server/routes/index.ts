import authRoutes from './auth.js';
import dashboardRoutes from './dashboard.js';
import loanRoutes from './loans.js';
import documentRoutes from './documents.js';
import schemeRoutes from './schemes.js';
import communityRoutes from './community.js';
import trainingRoutes from './training.js';
import toolsRoutes from './tools.js';
import settingsRoutes from './settings.js';
import aiRoutes from './ai.js';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/loans', loanRoutes);
router.use('/documents', documentRoutes);
router.use('/schemes', schemeRoutes);
router.use('/community', communityRoutes);
router.use('/training', trainingRoutes);
router.use('/tools', toolsRoutes);
router.use('/settings', settingsRoutes);
router.use('/ai', aiRoutes);

export default router;
