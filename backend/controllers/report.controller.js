const db = require('../models');
exports.printDocument = async (req, res) => {
  const { type, id } = req.params;

  const getQuery = (type) => {
    switch (type) {
      case 'pr':
        return {
          table: 'PurchaseRequests',
          where: 'pr_number = :id'
        };
      case 'po':
        return {
          table: 'PurchaseOrders',
          where: 'reference_no = :id'
        };
      case 'asset':
        return {
          table: 'assets',
          where: 'po_id = :id'
        };
      case 'stock':
        return {
          table: 'stock_items',
          where: 'po_id = :id'
        };
      default:
        return null;
    }
  };

  try {
    const queryData = getQuery(type);
    if (!queryData) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const [results] = await db.sequelize.query(
      `SELECT * FROM "${queryData.table}" WHERE ${queryData.where}`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ document: results });
  } catch (err) {
    console.error('printDocument error:', err);
    res.status(500).json({ error: 'Failed to print document', detail: err.message });
  }
};

exports.reportVendorBalance = async (req, res) => {
  const db = req.db;
  const { vendor_id } = req.params;

  try {
    const result = await db.query(
      `SELECT SUM(amount) AS total 
       FROM payments 
       WHERE vendor_id = $1 AND payment_date IS NULL`,
      [vendor_id]
    );

    res.json({ 
      vendor_id, 
      balance: result.rows[0].total ?? 0 // กรณีไม่มีข้อมูลให้เป็น 0
    });

  } catch (err) {
    console.error('reportVendorBalance error:', err);
    res.status(500).json({ error: 'Failed to generate report', detail: err.message });
  }
};

exports.listDocumentByType = async (req, res) => {
  const { type } = req.params;

  const tableMap = {
    pr: { table: 'PurchaseRequests', field: 'pr_number' },
    po: { table: 'PurchaseOrders', field: 'reference_no' },
    asset: { table: 'assets', field: 'po_id' },
    stock: { table: 'stock_items', field: 'po_id' },
  };

  const config = tableMap[type];
  if (!config) {
    return res.status(400).json({ message: 'Invalid document type' });
  }

  try {
    const results = await db.sequelize.query(
      `SELECT id, ${config.field} FROM "${config.table}" ORDER BY id DESC`,
      {
        type: db.Sequelize.QueryTypes.SELECT
      }
    );
    res.json(results);
  } catch (err) {
    console.error('listDocumentByType error:', err);
    res.status(500).json({ error: 'Failed to list documents', detail: err.message });
  }
};
