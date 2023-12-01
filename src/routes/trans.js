const express = require("express");
const router = express.Router();

const {
    purchaseItems,
    getTransaction,
    getStatusTrans,
    updateTrans,
} = require("../controllers/trans");

const middleware = require("../middleware");

router.post("/purchase", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], purchaseItems);
router.get("/detail/:trans_id", [ middleware.verifyJWT], getTransaction);
router.get('/status/:inv', [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], getStatusTrans);
router.get('/update', updateTrans)

module.exports = router;