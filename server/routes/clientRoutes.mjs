import express from "express";
import { getCategory, getCategoryData, getSubcategory, getCategoryBySlug, getManufacturerProducts, getSubcategoryManufacturers, getProductDetails } from "../controllers/categoryController.mjs";

const router = express.Router();



router.get("/category", getCategory);
router.get("/subcategories", getSubcategory);

router.get("/category/:category", getCategoryBySlug);
router.get("/category/:category/:subcategory", getCategoryBySlug);
router.get("/category/:category/:subcategory/manufacturer/:manufacturerId", getManufacturerProducts);
router.get("/category/:category/:subcategory/subcategory/:subcategoryId", getSubcategoryManufacturers);
router.get("/:category/:subcategory/:manufacturer/:productslug", getProductDetails);

export default router;