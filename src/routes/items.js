const express = require("express");
const router = express.Router();

const {
    addItem,
    fetchItem,
    getItem,
    updateItem,
    deleteItem,
} = require("../controllers/items");

const middleware = require("../middleware");

router.post("/add", [ middleware.verifyJWT, middleware.cekRole.cekRoleAdmin ], addItem);

router.get("/", fetchItem);
router.get("/:item_id", getItem);

router.put("/update/:item_id", updateItem);
router.delete("/delete/:item_id", deleteItem);

module.exports = router;