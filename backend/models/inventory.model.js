module.exports = {
    createTableSQL: `
      CREATE TABLE IF NOT EXISTS stock_items (
        id SERIAL PRIMARY KEY,
        po_id INTEGER REFERENCES purchase_orders(id),
        description TEXT,
        quantity INTEGER,
        unit TEXT,
        min_stock INTEGER,
        cost_per_unit NUMERIC(12,2),
        received_at TIMESTAMP
      );
  
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        stock_id INTEGER REFERENCES stock_items(id),
        quantity INTEGER,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
  };