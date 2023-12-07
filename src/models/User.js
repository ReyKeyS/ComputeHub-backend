const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    password: String, 
    display_name: String,
    address: String,
    phone_number: String,
    profile_picture: String,
    role: Number,
    status: {type: Boolean, default: true},
    email_verified: Boolean,
    deleted_at: Date,
    carts: [{
        item_id: {type: Schema.Types.ObjectId, ref: 'Item'},
        amount: Number,
    }],
    transactions: [{
        trans_id: {type: Schema.Types.ObjectId, ref: 'Transaction'},
        trans_invoice: String,
        trans_date: Date,
        grand_total: Number,
        status: Number,
    }],
    chats: [{
        id_sender: {type: Schema.Types.ObjectId, ref: 'User'},
        is_read: Boolean,
        latest_chat: String,
        latest_time: Date,
        chatting: [{
            content: String,
            sender: String,
            time: Date,
        }]
    }]
}, {
    timestamps: {createdAt: 'create_at', updatedAt: 'update_at'}, versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User