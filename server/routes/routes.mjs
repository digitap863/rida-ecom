import express from 'express';
import {  adminLogin} from '../controllers/controllers.mjs';
import { upload } from '../helpers/multer.mjs';
import { authMiddleware } from '../middleware/authMiddleware.mjs';
import { addCategory, deleteCategory, getCategory } from '../controllers/productController.mjs';



const router = express.Router();



router.post("/login", adminLogin)
router.post("/category", authMiddleware, addCategory)
router.get("/category", authMiddleware, getCategory)
router.delete("/category/:id", authMiddleware, deleteCategory)


export default router;