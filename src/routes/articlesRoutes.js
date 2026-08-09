import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

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
