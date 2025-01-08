import { deleteFile } from "../middleware/s3multer.mjs";
import { manufacturer as manufacturerModel } from "../model/manufacturer.mjs";
import { product as productModel } from "../model/product.mjs";
import { subcategory } from "../model/subcategory.mjs";
import { category as categorymodel } from "../model/category.mjs";


export const addManufacturer = async (req, res) => {
    try {
        const { name, description, subcategory,category } = req.body;
        const image = req.files[0].location;
        const key = req.files[0].key;
        if (image && name && description && subcategory && category) {
            const manufacturer = new manufacturerModel({
                name,
                description,
                subcategory,
                category,
                image,
                key,
            });
            await manufacturer.save();
            res
                .status(201)
                .send({ message: "Manufacturer added successfully", success: true });
        } else {
            res
                .status(400)
                .send({ message: "All fields are required", success: false });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const getManufacturer = async (req, res) => {
    try {
        const manufacturers = await manufacturerModel.find({});
        res.status(200).send({ manufacturers, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const deleteManufacturer = async (req, res) => {
    try {
        const { id } = req.params;
        const manufacturer = await manufacturerModel.findById(id);
        if (!manufacturer) {
            return res
                .status(404)
                .send({ message: "Manufacturer not found", success: false });
        }
        const key = manufacturer.key;
        try {
            await deleteFile(key);
            await manufacturerModel.findByIdAndDelete(id);
            res
                .status(200)
                .send({ message: "Manufacturer deleted successfully", success: true });
        } catch (deleteError) {
            console.error("Error deleting file from S3:", deleteError);
            res
                .status(500)
                .send({ message: "Error deleting file from S3", success: false });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};


export const addProducts = async (req, res) => {    
    try {
        const { partNumber, name, manufacturer, category, subcategory, model, description } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ 
                message: "At least one image is required", 
                success: false 
            });
        }

        const images = req.files.map(file => file.location);
        const imageKeys = req.files.map(file => file.key);

        if (partNumber && name && manufacturer && category && subcategory && model && description) {
            const product = new productModel({
                partNumber,
                name,
                manufacturer,
                image: images,      
                imageKey: imageKeys, 
                category,
                subcategory,
                model,
                description
            });
            await product.save();
            res.status(201).send({ 
                message: "Product added successfully", 
                success: true 
            });
        } else {
            res.status(400).send({ 
                message: "All fields are required", 
                success: false 
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ 
            message: error.message, 
            success: false 
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('manufacturer').populate('subcategory').populate('category');
        res.status(200).send({ products, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).send({ 
                message: "Product not found", 
                success: false 
            });
        }

        try {
            const deletePromises = product.imageKey.map(key => deleteFile(key));
            await Promise.all(deletePromises);
            
            await productModel.findByIdAndDelete(id);
            res.status(200).send({ 
                message: "Product deleted successfully", 
                success: true 
            });
        } catch (deleteError) {
            console.error("Error deleting files from S3:", deleteError);
            res.status(500).send({ 
                message: "Error deleting files from S3", 
                success: false 
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ 
            message: error.message, 
            success: false 
        });
    }
};

