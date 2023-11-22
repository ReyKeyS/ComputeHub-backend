require("dotenv/config");

const dictionary = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    HOST: process.env.HOST,
    CON_STRING: process.env.CON_STRING,
    CLIENT_KEY: process.env.CLIENT_KEY,
    SERVER_KEY: process.env.SERVER_KEY,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};

module.exports = function env(key) {
    return dictionary[key];
}