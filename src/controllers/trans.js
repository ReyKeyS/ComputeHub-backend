require("dotenv").config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");
const env = require("../config/env.config");

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
    newInv += year.toString() + (parseInt(month)+1).toString().padStart(2, '0') + date.toString().padStart(2, '0')
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
    
    if (build_service) grand_total += 200000

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
        trans_invoice: newTrans.invoice,
        trans_date: newTrans.trans_date,
        grand_total: newTrans.grand_total,
        status: newTrans.status
    });
    user.carts = [];

    await user.save();

    // Midtrans SNAP
    const option = {
        method: 'POST',
        url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
        headers: {accept: 'application/json', 'content-type': 'application/json',
            authorization: 'Basic '+Buffer.from(env("SERVER_KEY")).toString("base64")
        },
        data: {
            transaction_details: {
                order_id: newInv,
                gross_amount: grand_total,
            },
            customer_details: {
                email: user.email
            },
            credit_card: {secure: true},
            callbacks: { finish: 'http://localhost:5173/success'} // Page payment success fully / redirect ke history
        }
    }
    await axios.request(option).then( async (response)=>{
        console.log("\nTrans created successfully\n", newTrans, "\n")
        return res.status(201).json({message: "Requested Payment", data: newTrans, midtrans: response.data})
    })
}

const getTransaction = async (req, res) => {
    const { trans_id } = req.params

    const trans = await Transaction.findById(trans_id)
    if (trans == null) return res.status(404).json({message: "Transaction not found"})

    return res.status(200).json(trans)
}

const fetchTransaction = async (req, res) => {
    const trans = await Transaction.find({})
    .populate({
        path: 'user_id',
        select: 'display_name address '
    })
    .populate({
        path: 'detail_trans.item_id'
    });

    return res.status(200).json(trans)
}

const HistoryTransaction = async (req, res) => {
    const userId = req.params.userId; 
    console.log("userId", userId);
    const trans = await Transaction.find({ user_id: userId })
        .populate({
            path: 'user_id',
            select: 'display_name address'
        })
        .populate({
            path: 'detail_trans.item_id'
        });

        console.log("trans", trans);
    return res.status(200).json(trans);
}

// API for completing transaction
const updateTrans = async (req, res) => {
    const { transaction_status, order_id } = req.query;

    if (!transaction_status || !order_id) return res.status(403).json({ message: `Forbidden` });
    
    let status = transaction_status === 'settlement' ? 2 : transaction_status === 'pending' ? 0 : 0;

    // Update Transaction
    let trans = await Transaction.findOne({invoice: order_id});
    trans.status = status
    trans.payment_date = Date.now();

    // Update User
    let user = await User.findOne({"transactions.trans_invoice": trans.invoice})

    let nowTrans = user.transactions.find(t => t.trans_invoice == trans.invoice);
    nowTrans.status = status;
    nowTrans.payment_date = Date.now();

    await trans.save()
    await user.save() 

    return res.status(200).json({ message: 'Ok' });
}

const confirmTransaction = async (req, res) => {
    const { trans_id } = req.params
    const { status } = req.body

    let trans = await Transaction.findById(trans_id)
    if (trans == null) return res.status(404).json({message: "Transaction not found"})

    // Update Transaction
    trans.status = status

    // Update User
    let user = await User.findOne({"transactions.trans_invoice": trans.invoice})

    let nowTrans = user.transactions.find(t => t.trans_invoice == trans.invoice);
    nowTrans.status = status;

    await trans.save()
    await user.save() 

    // Update Stock
    if (status == 1){
        for (const d of trans.detail_trans) {
            let item = await Item.findById(d.item_id)

            item.stock -= d.qty

            await item.save();
        }
    }

    return res.status(200).json({message: "Transaction saved successfully"})
}

module.exports = {
    purchaseItems,
    getTransaction,
    fetchTransaction,
    updateTrans,
    confirmTransaction,
    HistoryTransaction,
}