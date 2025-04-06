const router = require("express").Router();
const controller = require("../controllers/pr.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.get("/generate-number", authenticate, controller.generateNumber);
router.post("/", authenticate, authorize(["procurement", "admin"]), controller.createPR);
router.get("/", authenticate, controller.getAllPRs);
// ✅ เปลี่ยน endpoint ให้ตรงกับ frontend
router.get("/waiting-approval", authenticate, authorize(["management", "admin"]), controller.getWaitingApprovalPRs);
router.post("/approve/:id", authenticate, authorize(["management", "admin"]), controller.approvePR);
router.post("/reject/:id", authenticate, authorize(["management", "admin"]), controller.rejectPR);
router.get('/approved', authenticate, authorize(['procurement', 'admin']), controller.getApprovedPRs);
router.get('/available-for-po', authenticate, authorize(['procurement', 'admin']), controller.getAvailablePRsForPO);




module.exports = router;