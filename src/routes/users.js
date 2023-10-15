const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    fetchUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/users");

const middleware = require("../middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", [middleware.verifyJWT], fetchUser);
router.get("/:user_id", getUser);
router.put("/update", updateUser);
router.delete("/:user_id", deleteUser);

module.exports = router;