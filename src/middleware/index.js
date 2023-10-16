const verifyJWT = require("./verifyJWT");
const cekRole = require("./cekRole");
const middleware = {};

middleware.verifyJWT = verifyJWT;
middleware.cekRole = cekRole;

module.exports = middleware;