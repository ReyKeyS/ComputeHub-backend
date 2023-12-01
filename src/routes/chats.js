const express = require("express");
const router = express.Router();

const {
    // readChat,
    addChat,
    // unsendChat,
    // pinChat,
} = require("../controllers/chats");

const middlewares = require("../middleware");

// router.put("/read/:id_chat", [middlewares.verifyJWT], readChat)
router.post("/add", [middlewares.verifyJWT], addChat)
// router.delete("/delete/:id_chat/:index", [middlewares.verifyJWT], unsendChat)
// router.put("/pin/:id_chat/:index", [middlewares.verifyJWT], pinChat)

module.exports = router;