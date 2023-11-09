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
    const { search, harga_min, harga_max } = req.query

    const items = await Item.find({name: { $regex: search, $options: 'i' }, price: {$gte: harga_min, $lte: harga_max}, status: true})

    return res.status(200).json(items)
}

const getItem = async (req, res) => {
    const { item_id } = req.params

    const item = await Item.findById(item_id)
    if (item == null) return res.status(404).json({message: "Item not found"})

    return res.status(200).json(item)
}

const updateItem = async (req, res) => {
    const { name, description, price, stock, category, brand } = req.body
    const { item_id } = req.params

    const item = await Item.findById(item_id)
    if (item == null) return res.status(404).json({message: "Item not found"})

    if (name) item.name = name
    if (description) item.description = description
    if (price){
        if (isNaN(price)) return res.status(400).json({message: "Price must be a number"})
        item.price = price
    }
    if (stock){
        if (isNaN(stock)) return res.status(400).json({message: "Stock must be a number"})
        item.stock = stock
    } 
    if (category) item.category
    if (brand) item.brand

    await item.save()

    return res.status(200).json({message: "Item saved successfully", data: item})
}

const deleteItem = async (req, res) => {
    const { item_id } = req.params
    
    const item = await Item.findById(item_id)
    if (item == null) return res.status(404).json({message: "Item not found"})

    item.status = false;
    item.deleted_at = Date.now();

    await item.save();
    
    return res.status(200).json({message: "Item deleted successfully"})
}

const addPromoItem = async (req, res) => {
    const { promo_price, start_date, end_date } = req.body
    const { item_id } = req.params

    const item = await Item.findById(item_id)
    if (item == null) return res.status(404).json({message: "Item not found"})
    
    // Validation
    try {
        let result = await schema.addPromoSchema.validateAsync(req.body, {
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

    item.discount = {
        promo_price: promo_price,
        start_date: start_date,
        end_date: end_date
    }

    item.save();

    return res.status(201).json({message: "Promo has been added", item: item})
}

const deletePromoItem = async (req, res) => {
    const { item_id } = req.params
    
    const item = await Item.findById(item_id)
    if (item == null) return res.status(404).json({message: "Item not found"})

    item.discount = undefined

    await item.save();
    
    return res.status(200).json({message: "Promo has been deleted", item: item})
}

module.exports = {
    addItem,
    fetchItem,
    getItem,
    updateItem,
    deleteItem,
    addPromoItem,
    deletePromoItem,
}