require("dotenv").config();
const { getConn } = require("../database/connection");
const schema = require('../utils/validation/index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Models
const User = require("../models/User");

const registerUser = async (req, res) => {
    const { name, email, address, phone_number, password, confirm_password } = req.body;

    // Validation
    try {
        let result = await schema.registerSchema.validateAsync(req.body, {
            abortEarly: false,
        })
    } catch (error) {
        const processedResult = error.details.reduce((hasil, item) => {
            const key = item.context.key || item.context.main;
            if (key in hasil) {
                hasil[key].push(item.message.replace("\"", "").replace("\"", ""));
            } else {
                hasil[key] = [item.message.replace("\"", "").replace("\"", "")];
            }
            return hasil;
        }, {});
        return res.status(400).json({ msg: "Validation failed", payload: processedResult });
    }

    // Cek Unique
    const cekEmail = await User.findOne({ email: email });
    if (cekEmail) return res.status(400).json({message: "Email is already in use"})

    // Password
    let hashedPassword;
    await bcrypt.hash(password, 10).then((hash) => hashedPassword = hash);

    const newUser = await User.create({
        display_name: name,
        email: email,
        address: address,
        phone_number: phone_number,
        password: hashedPassword,
        role: 1,
        status: true,
        created_at: Date.now(),
    })
    
    console.log("\nUser created successfully\n", newUser, "\n")
    return res.status(201).json({message: "User created successfully", data: newUser})
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    try {
        let result = await schema.loginSchema.validateAsync(req.body, {
            abortEarly: false,
        })
    } catch (error) {
        const processedResult = error.details.reduce((hasil, item) => {
            const key = item.context.key || item.context.main;
            if (key in hasil) {
                hasil[key].push(item.message.replace("\"", "").replace("\"", ""));
            } else {
                hasil[key] = [item.message.replace("\"", "").replace("\"", "")];
            }
            return hasil;
        }, {});
        return res.status(400).json({ msg: "Validation failed", payload: processedResult });
    }

    // Cek Email ada
    const user = await User.findOne({ email: email });
    if (user == null) return res.status(404).json({message: "Email is not registered"})
    
    // Cek Password
    const cekPassword = await bcrypt.compare(password, user.password);
    if (!cekPassword) return res.status(400).send({ message: "Password salah" })

    user.password = undefined;
    
    // JWT Token
    const accessToken = jwt.sign({
            user_id: user._id.toString(),
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d'}      // Development
        // { expiresIn: '5m'}   // Production
    )

    console.log("\nUser login Successfull\n", {token: accessToken}, "\n")
    return res.status(200).json({message: "User login successfully", data: {user: user.email, token: accessToken}})
}

const fetchUser = async (req, res) => {
    return res.sendStatus(200);
}

const getUser = async (req, res) => {}

const updateUser = async (req, res) => {}

const deleteUser = async (req, res) => {}

module.exports = {
    registerUser,
    loginUser,
    fetchUser,
    getUser,
    updateUser,
    deleteUser,
}