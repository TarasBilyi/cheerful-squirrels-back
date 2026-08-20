import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  checkEmail,
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  checkEmailSchema,
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);

router.get('/auth/check-email', celebrate(checkEmailSchema), checkEmail);

router.post('/auth/logout', authenticate, logoutUser);

router.post('/auth/login', celebrate(loginUserSchema), loginUser);

router.post('/auth/refresh', refreshUserSession);

export default router;
