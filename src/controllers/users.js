require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");

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
    if (cekEmail) return res.status(400).json({message: "Email is already used / banned"})

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
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d'}      // Development
        // { expiresIn: '5m'}   // Production
    )

    console.log("\nUser login Successfull\n", {token: accessToken}, "\n")
    return res.status(200).json({message: "User login successfully", data: {user: user.email, token: accessToken}})
}

const fetchUser = async (req, res) => {
    const users = await User.find({role: 1, status: true});
    
    users.forEach((user) => {user.password = undefined})
    return res.status(200).json(users);
}

const getUser = async (req, res) => {
    const { email } = req.params;

    let user = await User.findOne({email: email, status: true});
    if (user == null) return res.status(404).json({message: 'User not found'})

    user.password = undefined;
    return res.status(200).json(user);
}

const updateUser = async (req, res) => {
    const { display_name, address, phone_number } = req.body;
    const { email } = req.params
    
    let user = await User.findOne({email: email, status: true});
    if (user == null) return res.status(404).json({message: 'User not found'})

    if (display_name) {
        if (display_name.length < 3) return res.status(400).json({message: "Display name must be at least 3 characters"})
            user.display_name = display_name
    }

    if (address) user.address = address

    if (phone_number) user.phone_number = phone_number

    await user.save()

    user.password = undefined
    return res.status(200).json({message: "User updated successfully", data: user})
}

const deleteUser = async (req, res) => {
    const { email } = req.params

    let user = await User.findOne({email: email, status: true});
    if (user == null) return res.status(404).json({message: 'User not found'})

    user.status = false;
    user.deleted_at = Date.now();

    await user.save()

    return res.status(200).json({message: "User deleted successfully"})
}

module.exports = {
    registerUser,
    loginUser,
    fetchUser,
    getUser,
    updateUser,
    deleteUser,
}