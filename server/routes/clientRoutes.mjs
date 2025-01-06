import express from "express";
import { getCategory, getCategoryData } from "../controllers/categoryController.mjs";
import { categoryNavigation } from "../controllers/productController.mjs";

const router = express.Router();



router.get("/category", getCategory);

router.post("/navigation/:id",categoryNavigation)
router.get("/category/:category",getCategoryData)

export default router;