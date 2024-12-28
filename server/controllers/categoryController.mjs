import { category as categorymodel } from "../model/category.mjs";
import { subcategory as subcategoryModel } from "../model/subcategory.mjs";


export const addCategory = async (req, res) => {

    try {
        const { name, category } = req.body;

        if (name && category) {
            const isExist = await categorymodel.findOne({ name, category });
            if (isExist) {
                return res.status(400).send({ message: "Category already exists", success: false });
            }
            const addedcategory = new categorymodel({ name, category });
            await addedcategory.save();
            res.status(201).send({ message: "Category added successfully", success: true });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}


export const getCategory = async (req, res) => {
    try {
        const categories = await categorymodel.find({});
        res.status(200).send({ categories, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categorymodel.findByIdAndDelete(id);
        res.status(200).send({ message: "Category deleted successfully", success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}

export const addSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        
        // Ensure the category exists
        const category = await categorymodel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        const subcategory = new subcategoryModel({ name, category: categoryId });
        await subcategory.save();
        res.status(201).json({ success: true, data: subcategory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getSubcategory = async (req, res) => {
    try {
        const subcategories = await subcategoryModel.find({}).populate('category');
       
        res.status(200).json({ success: true, data: subcategories });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


export const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        await subcategoryModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


