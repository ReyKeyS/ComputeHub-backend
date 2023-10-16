const registerSchema = require('./registerSchema');
const loginSchema = require('./loginSchema')
const addItemSchema = require('./addItemSchema');
const addPromoSchema = require('./addPromoSchema');

const schema = {};

schema["registerSchema"] = registerSchema;
schema["loginSchema"] = loginSchema;
schema["addItemSchema"] = addItemSchema;
schema["addPromoSchema"] = addPromoSchema;

module.exports = schema;