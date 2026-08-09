import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import { checkArticleOwner } from '../middleware/checkArticleOwner.js';
import {
  updateArticle,
  getArticlesController,
  getCategoriesController,
  deleteArticle,
  createArticle,
  getArticleById,
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

router.get('/articles/:articleId', celebrate(articleIdSchema), getArticleById);

router.get('/categories', getCategoriesController);

router.patch(
  '/articles/:articleId',
  authenticate,
  celebrate(updateArticleSchema),
  checkArticleOwner,
  updateArticle,
);

router.delete(
  '/articles/:articleId',
  authenticate,
  celebrate(articleIdSchema),
  checkArticleOwner,
  deleteArticle,
);

export default router;
