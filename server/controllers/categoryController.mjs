import { deleteFile } from "../middleware/s3multer.mjs";
import { category as categorymodel } from "../model/category.mjs";
import { subcategory as subcategoryModel } from "../model/subcategory.mjs";
import { manufacturer as manufacturerModel } from "../model/manufacturer.mjs";
import { product as productModel } from "../model/product.mjs";

export const addCategory = async (req, res) => {
    try {
        const { name, category  } = req.body;
        const image = req.files[0].location;
        const imageKey = req.files[0].key;

        if (name && category && image) {
            const isExist = await categorymodel.findOne({ name, category });
            if (isExist) {
                return res
                    .status(400)
                    .send({ message: "Category already exists", success: false });
            }
            const addedcategory = new categorymodel({ name, category, image, imageKey });
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
        
        const category = await categorymodel.findById(id);
        if (!category) {
            return res
                .status(404)
                .send({ message: "Category not found", success: false });
        }

        if (category.imageKey) {
            await deleteFile(category.imageKey);
        }

        await categorymodel.findByIdAndDelete(id);
        
        res.status(200).send({ 
            message: "Category deleted successfully", 
            success: true 
        });
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



export const getCategoryBySlug = async (req, res) => {
    try {
        const { category, subcategory } = req.params;

        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const subcategories = await subcategoryModel
            .find({ category: findCategory._id })
            .lean();

        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subcategories found for this category",
            });
        }

        const currentSubcategory = subcategory 
            ? subcategories.find(sub => sub.subcategory === subcategory)
            : subcategories[0];

        if (!currentSubcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found",
            });
        }

        const manufacturers = await manufacturerModel
            .find({
                subcategory: currentSubcategory._id
            })
            .lean();

        let products = [];
        let defaultManufacturer = null;

        if (manufacturers.length > 0) {
            defaultManufacturer = manufacturers[0];
            
            products = await productModel
                .find({ 
                    manufacturer: defaultManufacturer._id,
                    category: findCategory._id,
                    subcategory: currentSubcategory._id
                })
                .populate('manufacturer')
                .populate('category')
                .populate('subcategory')
                .lean();
        }

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

        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

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

        const manufacturer = await manufacturerModel.findById(manufacturerId).lean();
        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }

        const products = await productModel
            .find({ 
                manufacturer: manufacturerId,
            })
            .populate('manufacturer')
            .populate('category')
            .populate('subcategory')
            .lean();

        res.status(200).json({
            success: true,
            data: {
                products,
                manufacturer,
                category: findCategory,
                subcategory: findSubcategory
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

export const getSubcategoryManufacturers = async (req, res) => {
    try {
        const { subcategoryId } = req.params;

        const manufacturers = await manufacturerModel
            .find({ subcategory: subcategoryId })
            .lean();

        res.status(200).json({
            success: true,
            data: {
                manufacturers
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getProductDetails = async (req, res) => {

    try {
        const { category, subcategory, manufacturer, product } = req.params;

        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const findSubcategory = await subcategoryModel.findOne({ 
            subcategory,
            category: findCategory._id 
        });
        if (!findSubcategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }

        
        const findManufacturer = await manufacturerModel.findOne({ 
            slug: manufacturer,
            category: findCategory._id,
            subcategory: findSubcategory._id
        });
        if (!findManufacturer) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found"
            });
        }

        const findProduct = await productModel.findOne({ 
            slug: product,
            manufacturer: findManufacturer._id,
            category: findCategory._id,
            subcategory: findSubcategory._id
        }).populate('manufacturer');

        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const relatedProducts = await productModel.find({
            manufacturer: findManufacturer._id,
            subcategory: findSubcategory._id,
            _id: { $ne: findProduct._id }
        })
        .limit(4)
        .populate('manufacturer')
        .populate('category')
        .populate('subcategory')
        .lean();
        res.status(200).json({
            success: true,
            data: {
                product: findProduct,
                category: findCategory,
                subcategory: findSubcategory,
                manufacturer: findManufacturer,
                relatedProducts 
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getProductSidebar = async (req, res) => {
    try {
        const { category, subcategory } = req.params;

        const findCategory = await categorymodel.findOne({ category });
        if (!findCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const subcategories = await subcategoryModel
            .find({ category: findCategory._id })
            .lean();

        const manufacturers = await manufacturerModel
            .find({
                subcategory: { $in: subcategories.map(sub => sub._id) }
            })
            .lean();

        const accordionData = subcategories.map(subcat => ({
            id: subcat._id,
            title: subcat.name,
            subcategorySlug: subcat.subcategory,
            items: manufacturers
                .filter(mfr => mfr.subcategory.toString() === subcat._id.toString())
                .map(mfr => ({
                    id: mfr._id,
                    name: mfr.name,
                    image: mfr.image,
                    description: mfr.description,
                    slug: mfr.slug
                })),
            isFirst: subcat.subcategory === subcategory,
            isEmpty: manufacturers.filter(mfr => mfr.subcategory.toString() === subcat._id.toString()).length === 0
        }));

        res.status(200).json({
            success: true,
            data: accordionData
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const updateData = { 
            name,
            category: name.toLowerCase().replace(/\s+/g, "-")
        };

        const oldCategory = await categorymodel.findById(id);
        if (!oldCategory) {
            return res.status(404).send({ message: "Category not found", success: false });
        }

        if (req.files && req.files[0]) {
            if (oldCategory.imageKey) {
                await deleteFile(oldCategory.imageKey);
            }
            updateData.image = req.files[0].location;
            updateData.imageKey = req.files[0].key;
        }

        const updatedCategory = await categorymodel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        

        res.status(200).send({ 
            message: "Category updated successfully", 
            success: true,
            category: updatedCategory 
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const updateSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId } = req.body;
        
        // Create update data
        const updateData = { 
            name,
            category: categoryId,
            subcategory: name.toLowerCase().replace(/\s+/g, "-")
        };

        // Find existing subcategory
        const oldSubcategory = await subcategoryModel.findById(id);
        if (!oldSubcategory) {
            return res.status(404).json({ 
                success: false, 
                message: "Subcategory not found" 
            });
        }

        // Handle image update if new file is uploaded
        if (req.files && req.files[0]) {
            if (oldSubcategory.imageKey) {
                await deleteFile(oldSubcategory.imageKey);
            }
            updateData.image = req.files[0].location;
            updateData.imageKey = req.files[0].key;
        }

        // Update subcategory
        const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('category');

        res.status(200).json({ 
            success: true, 
            message: "Subcategory updated successfully",
            data: updatedSubcategory
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

