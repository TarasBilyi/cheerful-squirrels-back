import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateArticle,
  getArticlesController,
  getCategoriesController,
  deleteArticle,
  getArticleById,
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

router.get('/articles', celebrate(getArticlesSchema), getArticlesController);

router.get('/articles/:articleId', celebrate(articleIdSchema), getArticleById);

router.post(
  '/articles',
  authenticate,
  upload.single('photo'),
  celebrate(createArticleSchema),
  createArticle,
);

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
