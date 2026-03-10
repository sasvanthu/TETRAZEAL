import { Router } from 'express';
import { getDocuments, uploadDocument, deleteDocument, updateDocumentStatus } from '../controllers/documentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getDocuments);
router.post('/', uploadDocument);
router.delete('/:id', deleteDocument);
router.patch('/:id/status', updateDocumentStatus);

export default router;
