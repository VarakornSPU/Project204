const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendor.controller');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.getAllVendors);

module.exports = router;
