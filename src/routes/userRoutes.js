import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserAvatar, getUserById, addSavedArticle, removeSavedArticle, updateUser } from '../controllers/userController.js';
import {
  getSavedArticles,
  getCreatedArticles,
} from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { celebrate } from 'celebrate';
import { updateUserSchema } from '../validations/authValidation.js';

const router = Router();

router.get('/users/saved', authenticate, getSavedArticles);
router.get('/users/:userId/articles', getCreatedArticles);
router.get('/users/:id', getUserById);

router.post('/saved', authenticate, addSavedArticle);
router.delete('/saved', authenticate, removeSavedArticle);

router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

router.patch('/users/me', authenticate, celebrate(updateUserSchema), updateUser);

export default router;
