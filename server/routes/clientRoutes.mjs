import express from "express";
import { getCategory, getCategoryData, getSubcategory, getCategoryBySlug, getManufacturerProducts } from "../controllers/categoryController.mjs";
import { categoryNavigation } from "../controllers/productController.mjs";

const router = express.Router();



router.get("/category", getCategory);
router.get("/subcategories", getSubcategory);

router.post("/navigation/:id",categoryNavigation)
router.get("/category/:category", getCategoryBySlug);
router.get("/category/:category/:subcategory", getCategoryBySlug);
router.get("/category/:category/:subcategory/manufacturer/:manufacturerId", getManufacturerProducts);

export default router;