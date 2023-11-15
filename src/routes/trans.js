const express = require("express");
const router = express.Router();

const {
    purchaseItems,
} = require("../controllers/trans");

const middleware = require("../middleware");

router.post("/purchase", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], purchaseItems);

module.exports = router;