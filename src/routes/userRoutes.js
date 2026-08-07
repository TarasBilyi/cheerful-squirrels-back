import { Router } from "express";
import {addSavedArticle} from "../controllers/userController.js"
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post('/user', authenticate, addSavedArticle);

export default router;
