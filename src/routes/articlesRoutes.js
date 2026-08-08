import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateArticle,
  getArticlesController,
  getCategoriesController,
  deleteArticle,
} from '../controllers/articlesController.js';
import {
  updateArticleSchema,
  getArticlesSchema,
  articleIdSchema,
} from '../validations/articlesValidation.js';

const router = Router();

router.get('/articles', celebrate(getArticlesSchema), getArticlesController);

router.get('/categories', getCategoriesController);

router.patch(
  '/articles/:articleId',
  authenticate,
  celebrate(updateArticleSchema),
  updateArticle,
);

router.delete(
  '/articles/:articleId',
  authenticate,
  celebrate(articleIdSchema),
  deleteArticle,
);

export default router;
