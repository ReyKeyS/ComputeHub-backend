const mongoose = require('mongoose');
const { Schema } = mongoose;

const transSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    invoice: String,
    trans_date: Date,
    build_pc: Boolean,
    grand_total: Number,
    detail_trans: [{
        item_id: {type: Schema.Types.ObjectId, ref: 'Item'},
        name: String,
        price: Number,
        qty: Number,
        subtotal: Number,
    }],
    status: Number,
}, {
    versionKey: false
});

const Transaction = mongoose.model('Transaction', transSchema);

module.exports = Transaction