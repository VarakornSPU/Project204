const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = db.User;
const Role = db.Role;

exports.register = async (req, res) => {
  const { username, password, role_id, first_name, last_name } = req.body;
  try {
    if (!username || !password || !role_id || !first_name || !last_name) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await Role.findByPk(role_id);
    if (!role) return res.status(400).json({ message: 'Invalid role_id' });

    const user = await User.create({
      username,
      password: hashedPassword,
      role_id: role.id,
      first_name,
      last_name,
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username }, include: [{ model: Role, as: 'role' }] });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role.name // ✅ Embed role name into token
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role.name }
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'first_name', 'last_name'],
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role?.name,
    });
  } catch (err) {
    console.error('[GET USER ERROR]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};