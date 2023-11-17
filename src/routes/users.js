const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    fetchUser,
    getUser,
    updateUser,
    updateProfPict,
    deleteUser,
} = require("../controllers/users");

const middleware = require("../middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], fetchUser);
router.get("/:email", [ middleware.verifyJWT ], getUser);
router.put("/update/:email", [ middleware.verifyJWT ], updateUser);
router.put("/updateprofpict/:email", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], updateProfPict)
router.delete("/delete/:email", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], deleteUser);

module.exports = router;