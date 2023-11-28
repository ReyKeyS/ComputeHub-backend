require("dotenv").config();
const jwt = require('jsonwebtoken');
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");

// Models
const User = require("../models/User");
const Item = require("../models/Item");

const addToCart = async (req, res) => {
    const { item_id, amount } = req.body;

    let user = await User.findOne({email: req.user_email, status: true});

    let ada = false;
    for (const userCart of user.carts) {
        if (item_id == userCart.item_id){
            ada = true;
            userCart.amount += parseInt(amount);
        }
    }

    if (!ada){
        user.carts.push({
            item_id: item_id,
            amount: amount
        })
    }
    
    await user.save();
    
    return res.status(200).json({message: "Added to cart", carts: user.carts});
}

const fetchCarts = async (req, res) => {
    const user = await User.findOne({email: req.user_email, status: true});

    return res.status(200).json({carts: user.carts})
}

const updateCarts = async (req, res) => {
    const { id } = req.params
    const { amount } = req.body

    let user = await User.findOne({email: req.user_email, status: true});

    let idx = -1;
    for (let i = 0; i < user.carts.length; i++) {
        if (user.carts[i]._id == id){
            idx = i;
            break;
        }
    }
    if (idx != -1) {
        user.carts[idx].amount = amount;
        await user.save();

        return res.status(200).json({message: 'Cart edited successfully', carts: user.carts})
    }else
        return res.status(400).json({message: "Failed to edit cart"})
}

const removeCarts = async (req, res) => {
    const { id } = req.params

    let user = await User.findOne({email: req.user_email, status: true});

    let idx = -1;
    for (let i = 0; i < user.carts.length; i++) {
        if (user.carts[i]._id == id){
            idx = i;
            break;
        }
    }
    if (idx != -1) {
        user.carts.splice(idx, 1);
        await user.save();

        return res.status(200).json({message: 'Carts removed successfully', carts: user.carts})
    }else
        return res.status(400).json({message: "Failed to remove cart"})
}

module.exports = {
    addToCart,
    fetchCarts,
    updateCarts,
    removeCarts,
}