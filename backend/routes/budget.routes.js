// backend/routes/budget.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/budget.controller");
const authenticate = require("../middlewares/authenticate");

router.get("/", authenticate, controller.getAllBudgets);

module.exports = router;
