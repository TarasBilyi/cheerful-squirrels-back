import { Router } from 'express';
import { getUserById } from '../controllers/users.controller.js';

const usersRouter = Router();

// Публічний ендпоінт — БЕЗ authMiddleware
usersRouter.get('/:id', getUserById);

export default usersRouter;
