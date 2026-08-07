import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { updateArticle } from '../controllers/articlesController.js';
import { updateArticleSchema } from '../validations/articlesValidation.js';

const router = Router();
router.use('/articles', authenticate);

router.patch(
  '/articles/:articleId',
  celebrate(updateArticleSchema),
  updateArticle,
);

export default router;
