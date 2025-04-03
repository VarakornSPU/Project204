const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck('admin', 'it'), controller.getAllUsers);
router.get('/:id', auth, controller.getUserById);
router.put('/:id/role', auth, roleCheck('admin'), controller.updateUserRole);
router.delete('/:id', auth, roleCheck('admin'), controller.deleteUser);

module.exports = router;