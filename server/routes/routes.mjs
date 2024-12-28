import express from 'express';
import {  adminLogin} from '../controllers/controllers.mjs';
import { authMiddleware } from '../middleware/authMiddleware.mjs';
import { addCategory, addSubcategory, deleteCategory, getCategory, getSubcategory } from '../controllers/categoryController.mjs';
import { addManufacturer, getManufacturer } from '../controllers/productController.mjs';
import { uploadS3 } from '../middleware/s3multer.mjs';



const router = express.Router();



router.post("/login", adminLogin)
router.post("/category", authMiddleware, addCategory)
router.get("/category", authMiddleware, getCategory)
router.delete("/category/:id", authMiddleware, deleteCategory)
router.post("/subcategory", authMiddleware, addSubcategory)
router.get("/subcategory", authMiddleware, getSubcategory)
// router.delete("/subcategory/:id", authMiddleware, deleteSubcategory)


router.get("/manufacturer", authMiddleware, getManufacturer)
router.post("/manufacturer", authMiddleware,uploadS3 ,addManufacturer)

export default router;