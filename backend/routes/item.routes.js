// backend/routes/item.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const db = require('../models');

// GET /api/items
router.get('/', auth, async (req, res) => {
  try {
    const items = await db.Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

module.exports = router;
