require("dotenv").config();
const { getConn } = require("../database/connection");

// Models
const User = require("../models/User");

const registerUser = async (req, res) => {
    const { name, email, address, phone_number, password, confirm_password } = req.body;

    if (password != confirm_password) return res.status(400).json({message: "Confirm password does not match"})

    const newUser = await User.create({
        display_name: name,
        email: email,
        address: address,
        phone_number: phone_number,
        password: password,
    })

    return res.status(200).json({message: "User created successfully", data: newUser})
}

module.exports = {
    registerUser
}