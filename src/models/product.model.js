import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

productoSchema.plugin(mongoosePaginate);

export const ProductoModel = mongoose.model("Product", productoSchema);