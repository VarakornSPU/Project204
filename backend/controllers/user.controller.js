exports.getAllUsers = async (req, res) => {
    const db = req.db;
    try {
      const result = await db.query('SELECT id, username, role FROM users');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users', detail: err });
    }
  };
  
  exports.getUserById = async (req, res) => {
    const db = req.db;
    const { id } = req.params;
    try {
      const result = await db.query('SELECT id, username, role FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user', detail: err });
    }
  };
  
  exports.updateUserRole = async (req, res) => {
    const db = req.db;
    const { id } = req.params;
    const { role } = req.body;
    try {
      await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
      res.json({ message: 'User role updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update role', detail: err });
    }
  };
  
  exports.deleteUser = async (req, res) => {
    const db = req.db;
    const { id } = req.params;
    try {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user', detail: err });
    }
  };