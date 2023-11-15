require("dotenv").config();
const jwt = require('jsonwebtoken');
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");

// Models
const User = require("../models/User");
const Item = require("../models/Item");
const Transaction = require("../models/Transaction");

const purchaseItems = async (req, res) => {
    const { build_service } = req.body

    let user = await User.findOne({email: req.user_email, status: true});

    if (user.carts.length < 1) return res.status(400).json({message: "Carts is empty"})

    let newInv = "INV";
    const year = new Date(Date.now()).getFullYear();
    const month = new Date(Date.now()).getMonth();
    const date = new Date(Date.now()).getDate();
    newInv += year.toString() + month.toString() + date.toString()
    let maxUrut = await Transaction.findOne({invoice: {$regex: new RegExp(`^${newInv}`)}}).sort({invoice: -1}).select({invoice: 1})
    if (maxUrut == null) newInv += "001";
    else {
        newInv += (parseInt(maxUrut.invoice.substring(11)) + 1).toString().padStart(3, '0');
    }

    let detailTrans = [];
    let grand_total = 0;
    for (const cart of user.carts) {
        const item = await Item.findOne({_id: cart.item_id})

        let priceNow = 0;
        if (item.discount?.promo_price) priceNow = item.discount.promo_price
        else priceNow = item.price

        detailTrans.push({
            item_id: item._id,
            name: item.name,
            price: priceNow,
            qty: cart.amount,
            subtotal: priceNow*cart.amount
        })

        grand_total += priceNow*cart.amount
    }
    
    if (build_service == "true") grand_total += 200000

    const newTrans = await Transaction.create({
        user_id: user._id,
        invoice: newInv,
        trans_date: Date.now(),
        build_pc: build_service,
        grand_total: grand_total,
        detail_trans: detailTrans,
        status: 0
    });

    user.transactions.push({
        trans_id: newTrans._id,
        trans_date: newTrans.trans_date,
        grand_total: newTrans.grand_total,
        status: newTrans.status
    });
    user.carts = [];

    await user.save();

    console.log("\nTrans created successfully\n", newTrans, "\n")
    return res.status(201).json({message: "Items purchased", data: newTrans})
}

module.exports = {
    purchaseItems,
}