module.exports = function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role || !allowedRoles.includes(user.role.name)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};
