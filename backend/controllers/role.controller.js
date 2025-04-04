// 📁 backend/controllers/role.controller.js
const { Role } = require('../models');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ['id', 'name'] });
    res.json(roles); // ✅ ต้องส่ง array ไม่ใช่ object
  } catch (err) {
    res.status(500).json({ message: 'Error fetching roles', error: err.message });
  }
};
