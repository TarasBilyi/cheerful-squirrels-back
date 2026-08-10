import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  updateUserAvatar,
  getCurrentUser,
  getUserById,
  addSavedArticle,
  removeSavedArticle,
  updateUser,
} from '../controllers/userController.js';
import {
  getSavedArticles,
  getCreatedArticles,
} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { compressImage } from '../middleware/compressImage.js';
import { celebrate } from 'celebrate';
import { updateUserSchema } from '../validations/authValidation.js';
import {
  userArticlesSchema,
  userIdSchema,
} from '../validations/userValidation.js';
import { savedArticleSchema } from '../validations/articlesValidation.js';

const router = Router();

router.get('/users/saved', authenticate, getSavedArticles);
router.get('/users/me', authenticate, getCurrentUser);
router.get(
  '/users/:userId/articles',
  celebrate(userArticlesSchema),
  getCreatedArticles,
);
router.get('/users/:id', celebrate(userIdSchema), getUserById);

router.post(
  '/saved',
  authenticate,
  celebrate(savedArticleSchema),
  addSavedArticle,
);
router.delete(
  '/saved',
  authenticate,
  celebrate(savedArticleSchema),
  removeSavedArticle,
);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  compressImage,
  updateUserAvatar,
);

router.patch(
  '/users/me',
  authenticate,
  celebrate(updateUserSchema),
  updateUser,
);

export default router;
