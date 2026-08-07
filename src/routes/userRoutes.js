import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { updateUserAvatar, addSavedArticle } from '../controllers/userController.js';
import { getSavedArticles, getCreatedArticles, } from '../controllers/userController.js';
import { upload } from "../middleware/multer.js";

const router = Router();

router.get('/saved', authenticate, getSavedArticles);
router.get('/:userId/articles', getCreatedArticles);

router.post('/saved', authenticate, addSavedArticle);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single("avatar"),
  updateUserAvatar,
);

export default router;