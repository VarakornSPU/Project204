const express = require('express');
const { User, Role } = require('../models');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// ✅ GET /api/users - ดึง users ทั้งหมดเรียงตาม id
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role' }],
      order: [['id', 'ASC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ✅ PUT /api/users/:id/role - แก้ role ของผู้ใช้
router.put('/:id/role', authenticate, async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role_id = role_id;
    await user.save();
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role' });
  }
});

// ✅ DELETE /api/users/:id - ลบผู้ใช้ (ห้ามลบตัวเอง)
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ message: "ไม่สามารถลบผู้ใช้ที่กำลังใช้งานอยู่ได้" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// ✅ GET /api/users/roles - ดึง role ทั้งหมด
router.get('/roles', authenticate, async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

module.exports = router;
