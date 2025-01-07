import { deleteFile } from "../middleware/s3multer.mjs";
import { category as categorymodel } from "../model/category.mjs";
import { subcategory as subcategoryModel } from "../model/subcategory.mjs";
import { manufacturer as manufacturerModel } from "../model/manufacturer.mjs";
import { product as productModel } from "../model/product.mjs";

export const addCategory = async (req, res) => {
    try {
        const { name, category } = req.body;

        if (name && category) {
            const isExist = await categorymodel.findOne({ name, category });
            if (isExist) {
                return res
                    .status(400)
                    .send({ message: "Category already exists", success: false });
            }
            const addedcategory = new categorymodel({ name, category });
            await addedcategory.save();
            res
                .status(201)
                .send({ message: "Category added successfully", success: true });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const getCategory = async (req, res) => {
    try {
        const categories = await categorymodel.find({});
        res.status(200).send({ categories, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categorymodel.findByIdAndDelete(id);
        res
            .status(200)
            .send({ message: "Category deleted successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const addSubcategory = async (req, res) => {
    try {
        const { name, categoryId, subcategory } = req.body;
        const image = req.files[0].location;
        const imageKey = req.files[0].key;

        // Ensure the category exists
        const category = await categorymodel.findById(categoryId);
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        const addedSubcategory = new subcategoryModel({
            name,
            category: categoryId,
            subcategory,
            image,
            imageKey,
        });
        await addedSubcategory.save();
        res.status(201).json({ success: true, data: addedSubcategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSubcategory = async (req, res) => {
    try {
        const subcategories = await subcategoryModel.find({}).populate("category");

        res.status(200).json({ success: true, data: subcategories });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subcategory = await subcategoryModel.findById(id);
        if (!subcategory) {
            return res
                .status(404)
                .json({ success: false, message: "Subcategory not found" });
        }
        const imagekey = subcategory.imageKey;
        await deleteFile(imagekey);
        await subcategoryModel.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "Subcategory deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subcategories = await subcategoryModel.find({ category: categoryId });
        res.status(200).json({
            success: true,
            subcategories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getBySubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const manufacturers = await manufacturerModel.find({ subcategory: subcategoryId });
        res.status(200).json({
            success: true,
            manufacturers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategoryData = async (req, res) => {
    try {
        const { category } = req.params;

        // Find the category by slug
        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Find all subcategories and populate their manufacturers
        const subcategories = await subcategoryModel
            .find({ category: findCategory._id })
            .lean();

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subcategories found for this category",
            });
        }

        // Get all manufacturers for all subcategories
        const allManufacturers = await manufacturerModel
            .find({
                subcategory: { $in: subcategories.map(sub => sub._id) }
            })
            .lean();

        // Get all products for the category
        const products = await productModel
            .find({ category: findCategory._id })
            .populate('manufacturer')
            .lean();

        // Set default subcategory and manufacturer
        const defaultSubcategory = subcategories[0];
        const defaultManufacturer = allManufacturers.find(
            m => m.subcategory.toString() === defaultSubcategory._id.toString()
        );

        // Group products by manufacturer
        const defaultProducts = products.filter(
            p => p.manufacturer._id.toString() === defaultManufacturer._id.toString()
        );

        res.status(200).json({
            success: true,
            data: {
                category: findCategory,
                subcategories,
                defaultSubcategory,
                manufacturers: allManufacturers,
                defaultManufacturer,
                products: defaultProducts
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getCategoryBySlug = async (req, res) => {
    try {
        const { category, subcategory } = req.params;

        // Find the category by slug
        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Find all subcategories for this category
        const subcategories = await subcategoryModel
            .find({ category: findCategory._id })
            .lean();

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subcategories found for this category",
            });
        }

        // Find the current subcategory or use the first one
        const currentSubcategory = subcategory 
            ? subcategories.find(sub => sub.subcategory === subcategory)
            : subcategories[0];

        if (!currentSubcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        // Get all manufacturers for all subcategories
        const manufacturers = await manufacturerModel
            .find({
                subcategory: currentSubcategory._id
            })
            .lean();

        // Get the default manufacturer (first one)
        const defaultManufacturer = manufacturers[0];

        // Get products for the current manufacturer
        const products = await productModel
            .find({ 
                manufacturer: defaultManufacturer._id,
                category: findCategory._id,
                subcategory: currentSubcategory._id
            })
            .populate('manufacturer')
            .lean();

        res.status(200).json({
            success: true,
            data: {
                category: findCategory,
                subcategories,
                currentSubcategory,
                manufacturers,
                defaultManufacturer,
                products
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getManufacturerProducts = async (req, res) => {
    try {
        const { category, subcategory, manufacturerId } = req.params;

        // First, find the category by slug
        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Then, find the subcategory by slug and category
        const findSubcategory = await subcategoryModel.findOne({ 
            subcategory: subcategory,
            category: findCategory._id 
        });
        if (!findSubcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        // Now get the products
        const products = await productModel
            .find({ 
                manufacturer: manufacturerId,
                category: findCategory._id,
                subcategory: findSubcategory._id
            })
            .populate('manufacturer')
            .lean();

        res.status(200).json({
            success: true,
            data: {
                products,
                manufacturer: await manufacturerModel.findById(manufacturerId).lean()
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

