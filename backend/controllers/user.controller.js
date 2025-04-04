// 📁 backend/controllers/user.controller.js
const { User, Role } = require('../models');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: { model: Role, as: 'role' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role_id } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role_id = role_id;
    await user.save();
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.destroy({ where: { id: userId } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};
