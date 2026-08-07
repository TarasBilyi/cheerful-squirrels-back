import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { updateArticle } from '../controllers/articlesController.js';
import { updateArticleSchema } from '../validations/articlesValidation.js';
import {
  getArticles,
  getArticleById,
  updateArticle,
} from '../controllers/articlesController.js';


const router = Router();

router.get('/articles', getArticles);

router.get('/articles/:articleId', getArticleById);


router.use('/articles', authenticate);

router.patch(
  '/articles/:articleId',
  celebrate(updateArticleSchema),
  updateArticle,
);

export default router;
