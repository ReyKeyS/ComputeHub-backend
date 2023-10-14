const express = require("express");
const router = express.Router();

const {
    registerUser
} = require("../controllers/users")

// const middleware = require("../middleware");

router.post("/register", registerUser)

module.exports = router;