import express from "express";
import { getCategory, getSubcategory, getCategoryBySlug, getManufacturerProducts, getSubcategoryManufacturers, getProductDetails } from "../controllers/categoryController.mjs";

const router = express.Router();



router.get("/category", getCategory);
router.get("/subcategories", getSubcategory);

router.get("/category/:category", getCategoryBySlug);
router.get("/category/:category/:subcategory", getCategoryBySlug);
router.get("/category/:category/:subcategory/manufacturer/:manufacturerId", getManufacturerProducts);
router.get("/category/:category/:subcategory/subcategory/:subcategoryId", getSubcategoryManufacturers);
router.get("/category/:category/:subcategory/:manufacturer/:product", getProductDetails);




export default router;