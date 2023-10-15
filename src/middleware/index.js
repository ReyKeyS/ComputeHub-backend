const verifyJWT = require("./verifyJWT");
const middleware = {};

middleware.verifyJWT = verifyJWT;

module.exports = middleware;