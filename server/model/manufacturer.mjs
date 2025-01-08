import mongoose from 'mongoose';


const manufacturerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    key: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
});

manufacturerSchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    next();
});

export const manufacturer = mongoose.model('Manufacturer', manufacturerSchema);