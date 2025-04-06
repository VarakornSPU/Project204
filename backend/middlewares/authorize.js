module.exports = (roles = []) => {
    return (req, res, next) => {
      const userRole = req.user?.role?.name;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
      next();
    };
  };