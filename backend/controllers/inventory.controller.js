exports.receiveGoods = async (req, res) => {
  const db = req.db;
  const { po_id, items } = req.body;

  try {
    // ✅ ตรวจสอบว่า po_id มีอยู่ใน PurchaseOrders
    const checkPO = await db.query('SELECT id FROM "PurchaseOrders" WHERE id = $1', [po_id]);
    if (checkPO.rowCount === 0) {
      return res.status(400).json({ error: 'PO ID not found in PurchaseOrders table.' });
    }

    for (let item of items) {
      await db.query(
        'INSERT INTO stock_items (po_id, description, quantity, unit, received_at) VALUES ($1, $2, $3, $4, NOW())',
        [po_id, item.description, item.quantity, item.unit]
      );
    }

    res.json({ message: 'Goods received successfully' });
  } catch (err) {
    console.error('❌ [RECEIVE ERROR]', err.message);
    console.error('🧾 Full error object:', err);
    res.status(500).json({
      error: 'Failed to receive goods',
      detail: err.message || err,
    });
  }
};



exports.autoGeneratePR = async (req, res) => {
  const db = req.db;
  try {
    const lowStockItems = await db.query(
      `SELECT id, description, quantity, min_stock, unit FROM stock_items WHERE quantity < min_stock`
    );

    for (let item of lowStockItems.rows) {
      const pr = await db.query(
        'INSERT INTO purchase_requests (created_by, description, required_date, status) VALUES ($1, $2, NOW(), $3) RETURNING id',
        [1, 'Auto PR for ' + item.description, 'auto']
      );

      await db.query(
        'INSERT INTO pr_items (pr_id, description, unit, unit_price, quantity, amount) VALUES ($1, $2, $3, 0, $4, 0)',
        [pr.rows[0].id, item.description, item.unit, item.min_stock - item.quantity]
      );
    }

    res.json({ message: 'Auto PRs generated if any stock below minimum' });
  } catch (err) {
    console.error('❌ [AUTO PR ERROR]', err.message);
    console.error('🧾 Full error object:', err);
    res.status(500).json({ error: 'Failed to auto-generate PRs', detail: err.message });
  }
};

exports.issueItem = async (req, res) => {
  const db = req.db;
  const { stock_id, quantity } = req.body;
  try {
    await db.query('UPDATE stock_items SET quantity = quantity - $1 WHERE id = $2', [quantity, stock_id]);
    await db.query(
      'INSERT INTO transactions (stock_id, quantity, issued_at) VALUES ($1, $2, NOW())',
      [stock_id, quantity]
    );
    res.json({ message: 'Item issued' });
  } catch (err) {
    console.error('❌ [ISSUE ERROR]', err.message);
    console.error('🧾 Full error object:', err);
    res.status(500).json({ error: 'Failed to issue item', detail: err.message });
  }
};

exports.getInventoryCosts = async (req, res) => {
  const db = req.db;
  try {
    const result = await db.query(
      `SELECT id, description, quantity, unit, cost_per_unit, (quantity * cost_per_unit) AS total_cost FROM stock_items`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ [INVENTORY COST ERROR]', err.message);
    console.error('🧾 Full error object:', err);
    res.status(500).json({ error: 'Failed to fetch inventory costs', detail: err.message });
  }
};
