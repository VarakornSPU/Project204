module.exports = {
    createTableSQL: `
      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        po_id INTEGER REFERENCES purchase_orders(id),
        name TEXT NOT NULL,
        unit_cost NUMERIC(12,2) NOT NULL,
        quantity INTEGER NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  };