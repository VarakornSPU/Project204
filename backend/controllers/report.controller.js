exports.printDocument = async (req, res) => {
    const db = req.db;
    const { type, id } = req.params;
    try {
      let result;
      if (type === 'pr') {
        result = await db.query('SELECT * FROM purchase_requests WHERE id = $1', [id]);
      } else if (type === 'po') {
        result = await db.query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
      } else if (type === 'asset') {
        result = await db.query('SELECT * FROM assets WHERE id = $1', [id]);
      } else if (type === 'stock') {
        result = await db.query('SELECT * FROM stock_items WHERE id = $1', [id]);
      } else {
        return res.status(400).json({ message: 'Invalid document type' });
      }
      res.json({ document: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to print document', detail: err });
    }
  };
  
  exports.reportVendorBalance = async (req, res) => {
    const db = req.db;
    const { vendor_id } = req.params;
    try {
      const result = await db.query(
        'SELECT SUM(amount) as total FROM payments WHERE vendor_id = $1 AND payment_date IS NULL',
        [vendor_id]
      );
      res.json({ vendor_id, balance: result.rows[0].total });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate report', detail: err });
    }
  };