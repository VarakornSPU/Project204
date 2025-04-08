const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const controller = require("../controllers/issue.controller");

router.post("/", authenticate, controller.createIssue);
router.get("/", authenticate, controller.getIssues);

module.exports = router;