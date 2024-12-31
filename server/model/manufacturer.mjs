
import mongoose from 'mongoose';


const manufacturerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    key: { type: String, required: true },
    description: { type: String, required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
});

export const manufacturer = mongoose.model('Manufacturer', manufacturerSchema);