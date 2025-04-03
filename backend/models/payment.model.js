module.exports = {
    createTableSQL: `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        vendor_id INTEGER,
        po_id INTEGER REFERENCES purchase_orders(id),
        amount NUMERIC(12,2),
        payment_date TIMESTAMP,
        payment_proof TEXT
      );
    `
  };
  