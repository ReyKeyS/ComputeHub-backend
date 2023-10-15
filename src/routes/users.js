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
router.get("/:email", [middleware.verifyJWT], getUser);
router.put("/update/:email", [middleware.verifyJWT], updateUser);
router.delete("/delete/:email", [middleware.verifyJWT], deleteUser);

module.exports = router;