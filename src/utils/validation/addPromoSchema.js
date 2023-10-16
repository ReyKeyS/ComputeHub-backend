const Joi = require('joi').extend(require('@joi/date'))

const addPromoSchema = Joi.object({
    promo_price: Joi.number()
        .required()
        .label("Promo Price")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    start_date: Joi.date()
        .required()
        .label("Start Date")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
    end_date: Joi.date()
        .required()
        .label("End Date")
        .messages({ 
            "any.required": "{{label}} is required",
        }),
})

module.exports = addPromoSchema;