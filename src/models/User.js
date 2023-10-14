const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String, 
    display_name: String,
    address: String,
    phone_number: String,
    role: Number,
    status: Boolean,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    carts: [{
        item_id: {type: Schema.Types.ObjectId, ref: 'Item'},
        amount: Number,
    }],
    transactions: [{
        trans_id: {type: Schema.Types.ObjectId, ref: 'Transaction;}'}, 
        trans_date: Date,
        grand_total: Number,
        status: Number,
    }],
    chats: [{
        chat: String,
        time: Date,
        sender: {type: Schema.Types.ObjectId, ref: 'User'}
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User