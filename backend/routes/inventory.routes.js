const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');
const auth = require('../middlewares/auth');

router.post('/receive', auth, controller.receiveGoods);
router.post('/auto-pr', auth, controller.autoGeneratePR);
router.post('/issue', auth, controller.issueItem);
router.get('/costs', auth, controller.getInventoryCosts);

module.exports = router;