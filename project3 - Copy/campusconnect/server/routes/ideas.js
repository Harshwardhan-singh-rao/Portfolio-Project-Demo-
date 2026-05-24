import { Router } from 'express';
import { generateIdeas } from '../controllers/ideaController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, generateIdeas);

export default router;
