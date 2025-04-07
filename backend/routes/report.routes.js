const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');
const auth = require('../middlewares/auth');

router.get('/print/:type/:id', auth, controller.printDocument);
router.get('/balance/:vendor_id', auth, controller.reportVendorBalance);
router.get('/list/:type', auth, controller.listDocumentByType); // ✅ route ใหม่

module.exports = router;
