const express = require("express");
const router = express.Router();

const {
    purchaseItems,
    getTransaction,
    fetchTransaction,
    getStatusTrans,
    updateTrans,
    confirmTransaction
} = require("../controllers/trans");

const middleware = require("../middleware");

router.post("/purchase", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], purchaseItems);
router.get("/detail/:trans_id", [ middleware.verifyJWT], getTransaction);
router.get("/fetch", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], fetchTransaction);
router.get('/update', updateTrans)
router.put('/confirm/:trans_id', [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], confirmTransaction);

module.exports = router;