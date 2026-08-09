import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateArticle,
  getArticlesController,
  getCategoriesController,
  deleteArticle,
  createArticle,
} from '../controllers/articlesController.js';
import {
  updateArticleSchema,
  getArticlesSchema,
  articleIdSchema,
  createArticleSchema,
} from '../validations/articlesValidation.js';
import { upload } from '../middleware/multer.js';

const router = Router();

router.post(
  '/articles',
  authenticate,
  upload.single('photo'),
  celebrate(createArticleSchema),
  createArticle,
);

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
