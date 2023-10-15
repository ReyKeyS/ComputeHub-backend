const Joi = require('joi').extend(require('@joi/date'))

const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .label("Display_Name")
        .messages({
            "any.required": "{{label}} is required",
            "string.min": "{{#label}} must be at least 3 characters",
        }),
    email: Joi.string()
        .email()
        .required()
        .label("Email")
        .messages({ 
            "any.required": "{{label}} is required",
            "string.email": "{{#label}} is not a valid email"
        }),
    address: Joi.string()
        .required()
        .label("Address")
        .messages({
            "any.required": "{{label}} is required",
        }),
    phone_number: Joi.string()
        .required()
        .label("Phone_Number")
        .messages({
            "any.required": "{{label}} is required",
        }),
    password: Joi.string()
        .min(6)
        .required()
        .label("Password")
        .messages({
            "any.required": "{{label}} is required",
            "string.min": "{{#label}} must be at least 6 characters",
        }),
    confirm_password: Joi.any()
        .equal(Joi.ref("password"))
        .label("Konfirmasi Password")
        .messages({ "any.only": "{{#label}} harus sama dengan password" }),
})

module.exports = registerSchema;