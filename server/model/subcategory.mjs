import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    imageKey: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

});
export const subcategory = mongoose.model('Subcategory', subcategorySchema);