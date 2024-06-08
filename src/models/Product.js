const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'],
    },
    size: {
        type: String,
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL'],
    },
    price: {
        type: Number,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
