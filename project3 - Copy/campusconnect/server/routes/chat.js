import { Router } from 'express';
import { getHistory } from '../controllers/chatController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/:peerId', auth, getHistory);

export default router;
