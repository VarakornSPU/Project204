const express = require('express');
const router = express.Router();
const controller = require('../controllers/po.controller');
const auth = require('../middlewares/auth');

// ตรวจสอบว่า controller.createPO ถูกต้อง
router.post('/', auth, controller.createPO);
router.get('/', auth, controller.getAllPOs);
router.get('/:id', auth, controller.getPOById);

module.exports = router;
