const express = require('express');
const router = express.Router();
const controller = require('../controllers/po.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, controller.createPO);
router.get('/', auth, controller.getAllPOs);
// ✅ ใหม่: ดึง PO ที่จ่ายเงินแล้ว
router.get('/used', auth, controller.getPaidPOs);
router.get('/:id', auth, controller.getPOById);


module.exports = router;
