import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    title: String,
    category: String,
    price: Number,
    stock: Number,
    description: String,
    developer: String,
    releaseYear: Number,
    thumbnails: [String],
    status: {
        type: Boolean,
        default: true
    }
});

export const ProductoModel = mongoose.model("Product", productoSchema);