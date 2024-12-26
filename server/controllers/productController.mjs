import { category as categorymodel } from "../model/category.mjs";


export const addCategory = async (req, res) => {

    try {
        const { name, category } = req.body;

        if (name && category) {
            const isExist = categorymodel.findOne({ name, category });
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