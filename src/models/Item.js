const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    name: String,
    description: String, 
    price: Number,
    stock: Number,
    discount: {
        promo_name: String,
        promo_price: Number,
        start_date: Date,
        end_date: Date,
    },
    ratings: [{rating: Number}],
    category: String,
    brand: String,
    picture: String,
    status: {type: Boolean, default: true},
    deleted_at: Date,
}, {
    timestamps: {createdAt: 'create_at', updatedAt: 'update_at'}, versionKey: false
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item