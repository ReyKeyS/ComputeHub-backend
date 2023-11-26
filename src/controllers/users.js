require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const env = require("../config/env.config")
const schema = require('../utils/validation/index');
const { getConn } = require("../database/connection");
const nodemailer = require('nodemailer');

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
        profile_picture: "default.png",
        role: 1,
        email_verified: false,
    })
    
    const token = jwt.sign({ email: email }, env("ACCESS_TOKEN_SECRET"), { expiresIn: "365d" });
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env("EMAIL_ADDRESS"),
            pass: env("EMAIL_PASSWORD")
        }
    });
    
    const mailOptions = {
        from: env("EMAIL_ADDRESS"),
        to: email,
        subject: 'Verify Your ComputeHUB Account & Unlock Exclusive Benefits + Special Offer Inside!',
        html: `
        <p style="text-align: center;
        font-size: 3.75rem;
        line-height: 1;
        color:#1b1b1b;
        ">Thank you for joining <div style="background-color:#1b1b1b;
        color:#ffffff;
        border-radius:1.25rem; 
        font-size: 3.75rem;
        line-height: 1;
        width: fit-content;
        margin-left:auto;
        margin-right:auto;
        padding:0.75rem;
        ">Compute<span style="background-color:#ffa31a;
        font-weight:700;
        border-radius: 0.5rem;
        color:#1b1b1b;
        ">HUB</span></div></p>

        <p style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        text-indent: 3rem;
        ">Your premier destination for all things computing! We're excited to have you on board, and to ensure you have the best possible experience, we kindly ask you to verify your email address.

        
        <br/>
        <div style="
        width:100%;
        display: grid;
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        text-align: center;
        ">
        To complete the verification process, simply click on the following link: 
        <a href='http://${ env("HOST") }:3000/api/users/verifyemail/${ token }' style="
        margin-left:auto;
        margin-right:auto;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        color:#1b1b1b;
        background-color:#ffa31a;
        border-radius: 0.5rem;
        text-decoration-line: none;
        font-weight: 700;
        font-size: 1.5rem;
        line-height: 2rem; 
        ">Verify</a>
        </p>
        </div>

        <p style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        text-indent: 3rem;
        ">
        By verifying your email, you're not just adding an extra layer of security to your ComputeHUB account, but you're also opening the door to a world of exclusive benefits. Get ready for early access to promotions, personalized product recommendations, and members-only discounts!
        
        With a vast selection of top-of-the-line computers, accessories, and cutting-edge gadgets, ComputeHUB is your one-stop-shop for all your computing needs. Whether you're a tech enthusiast or a casual user, our curated collection has something for everyone.
        
        Here's a sneak peek of what awaits you on ComputeHUB:
        <ul style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        ">
        <li>Latest Technology: Stay ahead with the newest releases in the tech world.</li>
        <li>Expert Reviews: Make informed decisions with our detailed product reviews.</li>
        <li>Fast & Secure Checkout: Enjoy a hassle-free shopping experience with our secure payment gateway.</li>
        <li>Dedicated Customer Support: Our team is here to assist you every step of the way</li>
        </ul>
        
        </p>
        <p style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        text-indent: 3rem;
        ">
        Remember, this special offer is valid for a limited time, so don't miss out! Verify your email, explore ComputeHUB, and treat yourself to the latest and greatest in computing technology.

        If you didn't sign up for a ComputeHUB account, please disregard this email. Your security is our priority, and we take all necessary measures to protect your information.
        
        Thank you for choosing ComputeHUB. We can't wait to serve you and provide an exceptional shopping experience.
        </p>

        <span style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        ">
        Best Regards,
        </span>
        <br/>
        <br/>
        <span style="
        font-size: 1.125rem;
        line-height: 1.75rem;
        color:#1b1b1b;
        ">
        ComputeHUB Team
        </span>
        `
    };
    
    let responseMailer = ""
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    console.log("\nUser created successfully\n", newUser, "\n")
    return res.status(201).json({message: "User created successfully", data: newUser, mailer: `http://${ env("HOST") }:3000/api/users/verifyemail/${ token }`})
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
        env("ACCESS_TOKEN_SECRET"),
        { expiresIn: '1d'}      // Development
        // { expiresIn: '5m'}   // Production
    )

    console.log("\nUser login Successfull\n", {user: user.email, role:user.role, token: accessToken}, "\n")
    return res.status(200).json({message: "User login successfully", data: {user: user.email, role:user.role, token: accessToken}})
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

const updateProfPict = async (req, res) => {
    const { email } = req.params
    
    const user = await User.findOne({email: email, status: true})
    if (user == null) return res.status(404).json({message: 'User not found'})
    
    req.id_user = user._id

    const uploadingFile = await upload.single("picture");
    uploadingFile(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res
                .status(400)
                .send((err.message || err.code) + " pada field " + err.field);
        }

        user.profile_picture = req.namaFile
        await user.save();

        return res.status(200).json({message: "Profile picture saved"})
    })   
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

const verifyEmail = async ( req, res )=>{
    const { token } = req.params

    jwt.verify(token, env("ACCESS_TOKEN_SECRET"), async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid Token" });
        }

        const user = await User.findOne({ email: decoded.email, status: true})
        if (user == null) return res.status(404).json({message: "User not found"})

        user.email_verified = true
        await user.save();

        return res.sendStatus(200);
    });
}

module.exports = {
    registerUser,
    loginUser,
    fetchUser,
    getUser,
    updateUser,
    updateProfPict,
    deleteUser,
    verifyEmail
}



// Function multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const folderName = `uploads/Profile`;

        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
        }

        callback(null, folderName);
    },
    filename: (req, file, callback) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (file.fieldname == "picture") {
            let namaFile = `profile_${req.id_user}${fileExtension}`;
            req.namaFile = namaFile
            callback(null, namaFile);
        } else {
            callback(null, false);
        }
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000, // 10mb
    },
    fileFilter: (req, file, callback) => {
        // buat aturan dalam bentuk regex, mengenai extension apa saja yang diperbolehkan
        const rules = /jpeg|jpg|png/;

        const fileExtension = path.extname(file.originalname).toLowerCase();
        const fileMimeType = file.mimetype;

        const cekExt = rules.test(fileExtension);
        const cekMime = rules.test(fileMimeType);

        if (cekExt && cekMime) {
            req.fileExt = fileExtension
            callback(null, true);
        } else {
            callback(null, false);
            return callback(
                new multer.MulterError(
                    "Tipe file harus .jpg, .jpeg, atau .png",
                    file.fieldname
                )
            );
        }
    },
});