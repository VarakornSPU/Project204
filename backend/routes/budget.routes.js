const router = require('express').Router();
const controller = require('../controllers/budget.controller');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.get('/', authenticate, authorize(["finance", "admin"]), controller.getAllBudgets);
router.post('/', authenticate, authorize(["finance", "admin"]), controller.createBudget);

module.exports = router;
