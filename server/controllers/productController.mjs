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
        console.log(req.files);
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
        const { partNumber, oe, manufacturer,category,subcategory } = req.body;
        const image = req.files[0].location;
        const key = req.files[0].key;
        if (partNumber && oe  && manufacturer && category && subcategory) {
            const product = new productModel({
                partNumber,
                oe,
                manufacturer,
                image,
                imageKey: key,
                category,
                subcategory
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


// Utility function to create a URL-friendly slug
export const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove non-word chars
    .replace(/[\s_-]+/g, '-')    // Replace spaces and _ with -
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing -
};

export const categoryNavigation = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the category by ID
    const categoryData = await categorymodel.findById(id)
      .select('name category')
      .lean();

    if (!categoryData) {
      return res.status(404).send({
        message: 'Category not found',
        success: false,
      });
    }

    const categorySlug = createSlug(categoryData.name);

    // Fetch subcategories
    const subcategories = await subcategory.find({ category: id })
      .select('name image imageKey')
      .lean();

    let allProducts = [];
    const detailedSubcategories = await Promise.all(
      subcategories.map(async (sub) => {
        const subcategorySlug = createSlug(sub.name);

        // Fetch manufacturers
        const manufacturers = await manufacturerModel.find({ subcategory: sub._id })
          .select('name image key description')
          .lean();

        const detailedManufacturers = await Promise.all(
          manufacturers.map(async (mfr) => {
            const manufacturerSlug = createSlug(mfr.name);
            console.log('manufacturerSlug', manufacturerSlug);
            
            // Create URL path
            const urlPath = `/${categorySlug}/${subcategorySlug}/${manufacturerSlug}`;
            console.log('urlPath', urlPath);

            const products = await productModel.find({ manufacturer: mfr._id })
              .select('partNumber image imageKey')
              .lean();

            // Add products to the combined products array
            allProducts = [...allProducts, ...products.map(p => ({
              ...p,
              manufacturerName: mfr.name,
              subcategoryName: sub.name,
              urlPath
            }))];

            return {
              id: mfr._id,
              name: mfr.name,
              image: mfr.image,
              key: mfr.key,
              description: mfr.description,
              slug: manufacturerSlug,
              urlPath,
              products: products.map(p => ({
                id: p._id,
                partNumber: p.partNumber,
                image: p.image,
                imageKey: p.imageKey
              }))
            };
          })
        );

        return {
          id: sub._id,
          name: sub.name,
          image: sub.image,
          imageKey: sub.imageKey,
          slug: subcategorySlug,
          urlPath: `/${categorySlug}/${subcategorySlug}`,
          manufacturers: detailedManufacturers
        };
      })
    );

    const response = {
      category: {
        id: categoryData._id,
        name: categoryData.name,
        category: categoryData.category,
        slug: categorySlug,
        urlPath: `/${categorySlug}`
      },
      subcategories: detailedSubcategories,
      allProducts // Combined products array
    };

    res.status(200).send({
      message: 'Category navigation data fetched successfully',
      success: true,
      data: response,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};