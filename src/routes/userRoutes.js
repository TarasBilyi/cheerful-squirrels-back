import { Router } from 'express';
import { celebrate } from 'celebrate';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateUserAvatar,
  getCurrentUser,
  updateCurrentUser,
  getUserById,
  addSavedArticle,
  removeSavedArticle,
} from '../controllers/userController.js';
import {
  getSavedArticles,
  getCreatedArticles,
} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { savedArticleSchema } from '../validations/articlesValidation.js';
import {
  updateUserSchema,
  userArticlesSchema,
  userIdSchema,
} from '../validations/userValidation.js';

const router = Router();

router.get('/users/saved', authenticate, getSavedArticles);
router.get('/users/me', authenticate, getCurrentUser);
router.patch(
  '/users/me',
  authenticate,
  celebrate(updateUserSchema),
  updateCurrentUser,
);
router.get(
  '/users/:userId/articles',
  celebrate(userArticlesSchema),
  getCreatedArticles,
);
router.get('/users/:id', celebrate(userIdSchema), getUserById);

router.post('/saved', authenticate, celebrate(savedArticleSchema), addSavedArticle);
router.delete('/saved', authenticate, celebrate(savedArticleSchema), removeSavedArticle);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
