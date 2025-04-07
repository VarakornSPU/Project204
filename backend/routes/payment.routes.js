const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const auth = require('../middlewares/authenticate');
const multer = require('multer');

// กำหนดที่เก็บหลักฐาน
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/payments'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/pending', auth, controller.getPendingInvoices);
router.post('/pay', auth, upload.single('payment_proof'), controller.makePayment);

module.exports = router;
