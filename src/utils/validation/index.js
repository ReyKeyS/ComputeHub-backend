const registerSchema = require('./registerSchema');
const loginSchema = require('./loginSchema')
const addItemSchema = require('./addItemSchema');

const schema = {};

schema["registerSchema"] = registerSchema;
schema["loginSchema"] = loginSchema;
schema["addItemSchema"] = addItemSchema;

module.exports = schema;