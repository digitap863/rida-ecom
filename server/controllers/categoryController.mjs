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
        const { name, categoryId } = req.body;
        const image = req.files[0].location;
        const imageKey = req.files[0].key;

        // Ensure the category exists
        const category = await categorymodel.findById(categoryId);
        if (!category) {
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        const subcategory = new subcategoryModel({
            name,
            category: categoryId,
            image,
            imageKey,
        });
        await subcategory.save();
        res.status(201).json({ success: true, data: subcategory });
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

        // Find all subcategories for the category
        const subcategories = await subcategoryModel.find({
            category: findCategory._id,
        });

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subcategories found for this category",
            });
        }

        // Find manufacturers for the first subcategory
        const defaultSubcategory = subcategories[0];
        const manufacturers = await manufacturerModel.find({
            subcategory: defaultSubcategory._id,
        });

        if (!manufacturers || manufacturers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No manufacturers found for the default subcategory",
            });
        }

        // Find products for the first manufacturer of the first subcategory
        const defaultManufacturer = manufacturers[0];
        const products = await productModel.find({
            manufacturer: defaultManufacturer._id,
        });

        // Return all the data
        res.status(200).json({
            success: true,
            data: {
                category: findCategory,
                subcategories,
                defaultSubcategory,
                manufacturers,
                defaultManufacturer,
                products,
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

