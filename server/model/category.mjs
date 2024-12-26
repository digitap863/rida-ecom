import mongoose from 'mongoose';
// const subcategorySchema = require('./Subcategory'); // Import the Subcategory schema

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    // subcategories: [subcategorySchema],
});

export const category = mongoose.model('Category', categorySchema);
