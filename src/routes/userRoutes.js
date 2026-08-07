import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { getSavedArticles, getCreatedArticles, } from '../controllers/userController.js';

const router = Router();

router.get('/saved', authenticate, getSavedArticles);

router.get('/:userId/articles', getCreatedArticles);

export default router;
