// routes/pr.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/pr.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, controller.createPR);  // สร้าง PR
router.get('/', auth, controller.getAllPRs);  // ดึงข้อมูล PR ทั้งหมด
router.get('/:id', auth, controller.getPRById);  // ดึงข้อมูล PR ตาม ID

module.exports = router;
