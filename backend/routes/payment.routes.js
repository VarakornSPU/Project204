const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const auth = require('../middlewares/auth');

router.post('/invoice', auth, controller.recordInvoice);
router.post('/pay', auth, controller.makePayment);

module.exports = router;