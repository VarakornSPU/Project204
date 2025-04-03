exports.registerAsset = async (req, res) => {
    const db = req.db;
    const { po_id, name, unit_cost, quantity } = req.body;
  
    try {
      await db.query(
        'INSERT INTO assets (po_id, name, unit_cost, quantity, registered_at) VALUES ($1, $2, $3, $4, NOW())',
        [po_id, name, unit_cost, quantity]
      );
      res.json({ message: 'Asset registered' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to register asset', detail: err });
    }
  };
  