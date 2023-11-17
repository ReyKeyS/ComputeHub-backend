const express = require("express");
const router = express.Router();

const {
    purchaseItems,
    getStatusTrans,
    updateTrans,
} = require("../controllers/trans");

const middleware = require("../middleware");

router.post("/purchase", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], purchaseItems);
router.get('/status/:inv', [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], getStatusTrans);
router.get('/update', updateTrans)

module.exports = router;