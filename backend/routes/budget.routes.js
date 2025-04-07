const express = require("express");
const router = express.Router();
const controller = require("../controllers/budget.controller");
const authenticate = require("../middlewares/authenticate"); // ✅ ต้องใช้ตัวนี้

router.get("/", authenticate, controller.getAllBudgets);
router.get("/report", authenticate, controller.getBudgetReport); // ✅ ต้องใช้ authenticate ตรงนี้

module.exports = router;
