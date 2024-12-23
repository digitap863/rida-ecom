import express from 'express';
import {  adminLogin} from '../controllers/controllers.mjs';
import { upload } from '../helpers/multer.mjs';
import { authMiddleware } from '../middleware/authMiddleware.mjs';



const router = express.Router();



router.post("/login", adminLogin)


export default router;