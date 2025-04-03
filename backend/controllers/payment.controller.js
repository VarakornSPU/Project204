exports.recordInvoice = async (req, res) => {
    const db = req.db;
    const { vendor_id, po_id, amount } = req.body;
    try {
      await db.query(
        'INSERT INTO payments (vendor_id, po_id, amount, payment_date, payment_proof) VALUES ($1, $2, $3, NULL, NULL)',
        [vendor_id, po_id, amount]
      );
      res.json({ message: 'Invoice recorded' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record invoice', detail: err });
    }
  };
  
  exports.makePayment = async (req, res) => {
    const db = req.db;
    const { payment_id, payment_proof } = req.body;
    try {
      await db.query(
        'UPDATE payments SET payment_date = NOW(), payment_proof = $1 WHERE id = $2',
        [payment_proof, payment_id]
      );
      res.json({ message: 'Payment recorded' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record payment', detail: err });
    }
  };