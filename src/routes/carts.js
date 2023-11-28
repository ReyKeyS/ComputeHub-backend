const express = require("express");
const router = express.Router();

const {
    addToCart,
    fetchCarts,
    updateCarts,
    removeCarts,
    getGrandTotal,
} = require("../controllers/carts");

const middleware = require("../middleware");

router.post("/add", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], addToCart);
router.get("/fetch", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], fetchCarts);
router.put("/edit/:id", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], updateCarts);
router.delete("/remove/:id", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], removeCarts);
router.get("/getgrandtotal", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], getGrandTotal);

module.exports = router;