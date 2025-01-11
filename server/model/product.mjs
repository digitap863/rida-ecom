import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    partNumber: { type: String, required: true },
    image: [{ type: String, required: true }],
    imageKey: [{ type: String, required: true }],
    model: { type: String, required: true },
    description: { type: String, required: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    specifications: { 
        type: String, 
        default: '' 
    },
    technicalData: { 
        type: String, 
        default: '' 
    },
    videoLink: { 
        type: String,
        default: '' 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

productSchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    next();
});

productSchema.pre('findOneAndUpdate', function(next) {
    this._update.lastUpdated = new Date();
    next();
});

export const product = mongoose.model('Product', productSchema);