const express = require("express");
const router = express.Router();

const {
    purchaseItems,
    getTransaction,
    fetchTransaction,
    getStatusTrans,
    updateTrans,
    HistoryTransaction,
    confirmTransaction,
    cancelTransaction,
} = require("../controllers/trans");

const middleware = require("../middleware");

router.post("/purchase", [ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], purchaseItems);
router.get("/detail/:trans_id", [ middleware.verifyJWT], getTransaction);
router.get("/fetch", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], fetchTransaction);
router.get("/history/fetch/:userId",[ middleware.verifyJWT, middleware.cekRole.cekRoleCustomer ], HistoryTransaction);
router.get('/update', updateTrans)
router.put('/confirm/:trans_id', [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], confirmTransaction);
router.put('/cancel/:trans_id', [middleware.verifyJWT, middleware.cekRole.cekRoleCustomer], cancelTransaction);

module.exports = router;