require("dotenv").config();
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");

// Models
const Item = require("../models/Item");

const addItem = async (req, res) => {
    const { name, description, price, stock, category, brand } = req.body   // kurang picture

    // Validation
    try {
        let result = await schema.addItemSchema.validateAsync(req.body, {
            abortEarly: false,
        })
    } catch (error) {
        const processedResult = error.details.reduce((hasil, item) => {
            const key = item.context.key || item.context.main;
            if (key in hasil) {
                hasil[key].push(item.message.replace("\"", "").replace("\"", ""));
            } else {
                hasil[key] = [item.message.replace("\"", "").replace("\"", "")];
            }
            return hasil;
        }, {});
        return res.status(400).json({ msg: "Validation failed", payload: processedResult });
    }

    const newItem = await Item.create({
        name: name,
        description: description,
        price: price,
        stock: stock, 
        category: category,
        brand: brand
    })
    
    console.log("\nItem created successfully\n", newItem, "\n")
    return res.status(201).json({message: "Item created successfully", data: newItem})
}

const fetchItem = async (req, res) => {

}

const getItem = async (req, res) => {
    
}

const updateItem = async (req, res) => {
    
}

const deleteItem = async (req, res) => {
    
}

module.exports = {
    addItem,
    fetchItem,
    getItem,
    updateItem,
    deleteItem,
}