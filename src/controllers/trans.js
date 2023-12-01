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

// Optional
const getStatusTrans = async (req, res) => {
    const { inv } = req.params
    
    const options = {
        method: 'GET',
        url: `https://api.sandbox.midtrans.com/v2/${inv}/status`,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic ' + Buffer.from(env("SERVER_KEY")).toString("base64")
        }
    };

    axios.request(options).then(async response => {
        console.log(response);
        return res.status(200).json({
            invoice: response.data.invoice,
            transaction_status: response.data.transaction_status,
        })
    }).catch(err => {
        return res.status(502).json(err.message)
    })
}

// API for completing transaction
const updateTrans = async (req, res) => {
    const { transaction_status, order_id } = req.query;

    if (!transaction_status || !order_id) return res.status(403).json({ message: `Forbidden` });
    
    let status = transaction_status === 'settlement' ? 2 : transaction_status === 'pending' ? 0 : 0;
    let trans = await Transaction.findOne({invoice: order_id});

    trans.status = status
    trans.payment_date = Date.now();

    await trans.save();

    return res.status(200).json({ message: 'Ok' });
}

module.exports = {
    purchaseItems,
    getTransaction,
    getStatusTrans,
    updateTrans,
}