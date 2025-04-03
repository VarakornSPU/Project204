module.exports = {
  createTableSQL: `
    CREATE TABLE IF NOT EXISTS stock_items (
      id SERIAL PRIMARY KEY,
      po_id INTEGER REFERENCES "PurchaseOrders"(id),
      description TEXT,
      quantity INTEGER,
      unit TEXT,
      min_stock INTEGER DEFAULT 10,
      cost_per_unit NUMERIC(12,2) DEFAULT 0,
      received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      stock_id INTEGER REFERENCES stock_items(id),
      quantity INTEGER,
      issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};
