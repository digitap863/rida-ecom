import express from "express";
import { adminLogin } from "../controllers/authControllers.mjs";
import { authMiddleware } from "../middleware/authMiddleware.mjs";
import {
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
  getByCategory,
  getBySubcategory,
  getCategory,
  getSubcategory,
} from "../controllers/categoryController.mjs";
import {
  addManufacturer,
  addProducts,
  deleteManufacturer,
  deleteProduct,
  getManufacturer,
  getProductById,
  getProducts,
  updateProductDetails,
  getProductDetails
} from "../controllers/productController.mjs";
import { uploadS3 } from "../middleware/s3multer.mjs";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/category", authMiddleware, addCategory);
router.get("/category", authMiddleware, getCategory);
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
router.get("/products/:id", authMiddleware, getProductById);
router.post("/product", authMiddleware, uploadS3.any(), addProducts);
router.delete("/product/:id", authMiddleware, deleteProduct)

router.put("/products/:id/details", authMiddleware, updateProductDetails);
router.get("/products/:id/details", authMiddleware, getProductDetails);

router.post("/upload-image", authMiddleware, uploadS3.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        res.json({
            location: req.file.location, // S3 URL of the uploaded image
            key: req.file.key
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

export default router;
