const express = require("express");
const router = express.Router();

const {
    addItem,
    fetchItem,
    getItem,
    updateItem,
    deleteItem,
    addPromoItem,
    deletePromoItem,
    getItemPromo,
} = require("../controllers/items");

const middleware = require("../middleware");

router.post("/add", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], addItem);

router.get("/fetch", fetchItem);
router.get("/:item_id", getItem);
router.get("/promo/fetch", getItemPromo);

router.put("/update/:item_id", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], updateItem);
router.delete("/delete/:item_id", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], deleteItem);

router.put("/promo/add/:item_id", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], addPromoItem);
router.delete("/promo/delete/:item_id", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], deletePromoItem);


module.exports = router;