const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roleCheck');

router.get('/dashboard', auth, checkRole(['admin']), (req, res) => {
  res.json({ message: `Welcome to the admin dashboard, ${req.user.username}` });
});

module.exports = router;
