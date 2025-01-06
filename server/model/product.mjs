import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    partNumber: { type: String, required: true },
    image: { type: String, required: true },
    imageKey: { type: String, required: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }
});

export const product = mongoose.model('Product', productSchema);