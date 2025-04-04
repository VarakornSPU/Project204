const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roleCheck');

router.get('/dashboard', auth, checkRole(['it']), (req, res) => {
  res.json({ message: `Welcome to the IT dashboard, ${req.user.username}` });
});

module.exports = router;
