const registerSchema = require('./registerSchema');
const loginSchema = require('./loginSchema')

const schema = {};

schema["registerSchema"] = registerSchema;
schema["loginSchema"] = loginSchema;

module.exports = schema;