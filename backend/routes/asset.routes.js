const express = require('express');
const router = express.Router();
const controller = require('../controllers/asset.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, controller.registerAsset);

module.exports = router;