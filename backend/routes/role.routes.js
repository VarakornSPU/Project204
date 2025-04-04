// 📁 routes/role.routes.js
const express = require('express');
const router = express.Router();
const { Role } = require('../models');
const authenticate = require('../middlewares/authenticate');

// ✅ GET /api/roles
router.get('/', authenticate, async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

module.exports = router;
