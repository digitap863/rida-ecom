import express from "express";
import { adminLogin } from "../controllers/controllers.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import {
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
  getByCategory,
  getBySubcategory,
  getCategory,
  getCategoryData,
  getSubcategory,
} from "../controllers/categoryController.mjs";
import {
  addManufacturer,
  addProducts,
  categoryNavigation,
  deleteManufacturer,
  deleteProduct,
  getManufacturer,
  getProducts,
} from "../controllers/productController.mjs";
import { uploadS3 } from "../middleware/s3multer.mjs";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/category", authMiddleware, addCategory);
router.get("/category", getCategory);
router.delete("/category/:id", authMiddleware, deleteCategory);
router.post("/subcategory", authMiddleware,uploadS3.any(),addSubcategory);
router.get("/subcategory", authMiddleware, getSubcategory);
router.delete("/subcategory/:id", authMiddleware, deleteSubcategory)
router.get('/category/:categoryId', getByCategory);
router.get('/subcategory/:subcategoryId', getBySubcategory);


router.get("/manufacturer", authMiddleware, getManufacturer);
router.post("/manufacturer", authMiddleware, uploadS3.any(), addManufacturer);
router.delete("/manufacturer/:id", authMiddleware, deleteManufacturer);

router.get("/product", authMiddleware, getProducts);
router.post("/product", authMiddleware, uploadS3.any(), addProducts);
router.delete("/product/:id", authMiddleware, deleteProduct)

//client routes
router.post("/navigation/:id",categoryNavigation)
router.get("/category/:category",getCategoryData)



export default router;
