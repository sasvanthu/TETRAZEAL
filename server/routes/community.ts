import { Router } from 'express';
import { getPosts, getPost, createPost, likePost, addReply, deletePost } from '../controllers/communityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/replies', addReply);

export default router;
