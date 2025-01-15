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

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        res.status(200).send({ product, success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message, success: false });
    }
}

export const updateProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { specifications, technicalData, videoLink } = req.body;

        // Find and update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(specifications !== undefined && { specifications }),
                    ...(technicalData !== undefined && { technicalData }),
                    ...(videoLink !== undefined && { videoLink }),
                    lastUpdated: new Date()
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({
                message: "Product not found",
                success: false
            });
        }

        res.status(200).send({
            message: "Product details updated successfully",
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id)
            .select('specifications technicalData videoLink lastUpdated')
            .lean();

        if (!product) {
            return res.status(404).send({
                message: "Product not found",
                success: false
            });
        }

        res.status(200).send({
            success: true,
            product
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};

export const updateManufacturer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subcategory, category } = req.body;
        
        // Find existing manufacturer
        const manufacturer = await manufacturerModel.findById(id);
        if (!manufacturer) {
            return res.status(404).send({ 
                message: "Manufacturer not found", 
                success: false 
            });
        }

        // Create update data
        const updateData = {
            name,
            description,
            subcategory,
            category
        };

        // Handle image update if new file is uploaded
        if (req.files && req.files[0]) {
            // Delete old image
            if (manufacturer.key) {
                await deleteFile(manufacturer.key);
            }
            updateData.image = req.files[0].location;
            updateData.key = req.files[0].key;
        }

        // Update manufacturer
        const updatedManufacturer = await manufacturerModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).send({
            message: "Manufacturer updated successfully",
            success: true,
            manufacturer: updatedManufacturer
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ 
            message: error.message, 
            success: false 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, partNumber, manufacturer, category, subcategory, model, description } = req.body;
        const removedImageIndexes = JSON.parse(req.body.removedImageIndexes || '[]');
        
        // Find existing product
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).send({ 
                message: "Product not found", 
                success: false 
            });
        }

        // Create update data
        const updateData = {
            name,
            partNumber,
            manufacturer,
            category,
            subcategory,
            model,
            description
        };

        // Handle image updates
        if (removedImageIndexes.length > 0 || (req.files && req.files.length > 0)) {
            // Keep only non-removed existing images
            const remainingImages = product.image.filter((_, index) => !removedImageIndexes.includes(index));
            const remainingKeys = product.imageKey.filter((_, index) => !removedImageIndexes.includes(index));

            // Delete removed images from S3
            const deletePromises = removedImageIndexes.map(index => deleteFile(product.imageKey[index]));
            await Promise.all(deletePromises);

            // Add new images
            if (req.files && req.files.length > 0) {
                updateData.image = [...remainingImages, ...req.files.map(file => file.location)];
                updateData.imageKey = [...remainingKeys, ...req.files.map(file => file.key)];
            } else {
                updateData.image = remainingImages;
                updateData.imageKey = remainingKeys;
            }
        }

        // Update product
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('manufacturer')
         .populate('category')
         .populate('subcategory');

        res.status(200).send({
            message: "Product updated successfully",
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ 
            message: error.message, 
            success: false 
        });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).send({ products: [], success: true });
        }

        const products = await productModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { partNumber: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } }
            ]
        })
        .populate('manufacturer', 'name')
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .select('name partNumber model image slug')
        .limit(8);

        res.status(200).send({
            products,
            success: true
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};