const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: String,
    description: String, 
    price: Number,
    stock: Number,
    discount: {
        promo_price: Number,
        start_date: Date,
        end_date: Date,
    },
    ratings: [{rating: Number}],
    category: String,
    brand: String,
    picture: String,
    status: Boolean,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item