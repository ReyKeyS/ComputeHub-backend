const Joi = require('joi').extend(require('@joi/date'))

const addItemSchema = Joi.object({
    name: Joi.string()
        .required()
        .label("Name")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    description: Joi.string()
        .required()
        .label("Description")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    price: Joi.number()
        .required()
        .label("Price")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    stock: Joi.number()
        .required()
        .label("Stock")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    category: Joi.string()
        .required()
        .label("Category")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    brand: Joi.string()
        .required()
        .label("Brand")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
})

module.exports = addItemSchema;