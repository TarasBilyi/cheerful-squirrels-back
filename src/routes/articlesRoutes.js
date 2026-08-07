import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateArticle,
  getArticlesController,
  getCategoriesController,
} from '../controllers/articlesController.js';
import {
  updateArticleSchema,
  getArticlesSchema,
} from '../validations/articlesValidation.js';

const router = Router();


router.get(
  '/articles',
  celebrate(getArticlesSchema),
  getArticlesController,
);

router.get('/categories', getCategoriesController);


router.patch(
  '/articles/:articleId',
  authenticate,
  celebrate(updateArticleSchema),
  updateArticle,
);

export default router;
