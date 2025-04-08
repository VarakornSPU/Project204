const express = require("express");
const router = express.Router();
const controller = require("../controllers/stock_item.controller");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, controller.getAllStockItems);

module.exports = router;
