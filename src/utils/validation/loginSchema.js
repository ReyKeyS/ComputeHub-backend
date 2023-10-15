const Joi = require('joi').extend(require('@joi/date'))

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .label("Email")
        .messages({ 
            "any.required": "{{label}} is required",
            "string.email": "{{#label}} is not a valid email"
        }),
    password: Joi.string()
        .min(6)
        .required()
        .label("Password")
        .messages({
            "any.required": "{{label}} is required",
            "string.min": "{{#label}} must be at least 6 characters",
        }),
})

module.exports = loginSchema;