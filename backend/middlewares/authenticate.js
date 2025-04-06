const jwt = require('jsonwebtoken');
const db = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');

    const user = await db.User.findByPk(decoded.id, {
      include: [{ model: db.Role, as: 'role', attributes: ['name'] }],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      role: { name: user.role.name },
    };
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;
