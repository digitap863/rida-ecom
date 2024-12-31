import { deleteFile } from "../middleware/s3multer.mjs";
import { manufacturer as manufacturerModel } from "../model/manufacturer.mjs";
import { product as productModel } from "../model/product.mjs";

export const addManufacturer = async (req, res) => {
    try {
        const { name, description, subcategory } = req.body;
        const image = req.files[0].location;
        const key = req.files[0].key;
        console.log(req.files);
        if (image && name && description && subcategory) {
            const manufacturer = new manufacturerModel({
                name,
                description,
                subcategory,
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
            // Delete the image from S3
            await deleteFile(key);
            // Delete the manufacturer from database
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

//products
export const addProducts = async (req, res) => {
    try {
        const { partNumber, oe, description, manufacturer } = req.body;
        const image = req.files[0].location;
        const key = req.files[0].key;
        if (partNumber && oe && description && manufacturer) {
            const product = new productModel({
                partNumber,
                oe,
                description,
                manufacturer,
                image,
                imageKey: key
            });
            await product.save();
            res
                .status(201)
                .send({ message: "Product added successfully", success: true });
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

export const getProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
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
            return res
                .status(404)
                .send({ message: "product not found", success: false });
        }
        const key = product.imageKey;
        try {
            // Delete the image from S3
            await deleteFile(key);
            // Delete the manufacturer from database
            await productModel.findByIdAndDelete(id);
            res
                .status(200)
                .send({ message: "product deleted successfully", success: true });
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