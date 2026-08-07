import { Router } from 'express';
import { celebrate } from 'celebrate';
import { logoutUser, registerUser } from '../controllers/authController.js';
import { registerUserSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);

router.post('/auth/logout', logoutUser);

export default router;
