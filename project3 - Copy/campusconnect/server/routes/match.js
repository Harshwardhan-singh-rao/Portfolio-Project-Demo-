import { Router } from 'express';
import { matchTeammates } from '../controllers/matchController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/', auth, matchTeammates);

export default router;
