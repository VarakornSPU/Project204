const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const db = {};

// Load models
db.Role = require('./role.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes);
db.Item = require('./item.model')(sequelize, DataTypes);
db.Vendor = require('./vendor.model')(sequelize, DataTypes);
db.PurchaseRequest = require('./purchase_requests.model')(sequelize, DataTypes);
db.PRDetail = require('./prdetail.model')(sequelize, DataTypes);
db.PurchaseOrder = require('./po.model')(sequelize, DataTypes);
db.POItem = require('./poitem.model')(sequelize, DataTypes);
db.Budget = require('./budget.model')(sequelize, DataTypes);
db.Payment = require('./payment.model')(sequelize, DataTypes);
db.Receipt = require('./receipt.model')(sequelize, DataTypes);
db.Invoice = require('./invoice.model')(sequelize, DataTypes);
db.StockItem = require('./stock_item.model')(sequelize, DataTypes);

// ✅ เพิ่มตรงนี้: สำหรับระบบเบิกของ
db.IssueRequest = require('./issuerequest.model')(sequelize, DataTypes);
db.IssueDetail = require('./issuedetail.model')(sequelize, DataTypes);

// ====== ความสัมพันธ์หลัก ======

// Payment
db.Payment.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id', as: 'po' });
db.PurchaseOrder.hasMany(db.Payment, { foreignKey: 'po_id', as: 'payments' });

db.Payment.belongsTo(db.Invoice, { foreignKey: 'invoice_id', as: 'invoice' });
db.Invoice.hasMany(db.Payment, { foreignKey: 'invoice_id', as: 'payments' });

db.Payment.belongsTo(db.Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
db.Vendor.hasMany(db.Payment, { foreignKey: 'vendor_id', as: 'payments' });

// Vendor - PO
db.PurchaseOrder.belongsTo(db.Vendor, { foreignKey: 'vendor_id' });

// Receipt - PO
db.Receipt.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });
db.PurchaseOrder.hasMany(db.Receipt, { foreignKey: 'po_id' });

// StockItem ↔ Item
db.StockItem.belongsTo(db.Item, { foreignKey: 'item_id' });
db.Item.hasMany(db.StockItem, { foreignKey: 'item_id' });

// ✅ ความสัมพันธ์ของ IssueRequest
db.IssueRequest.belongsTo(db.User, { foreignKey: 'requester_id', as: 'requester' });
db.IssueRequest.hasMany(db.IssueDetail, { foreignKey: 'issue_request_id', as: 'details' });

db.IssueDetail.belongsTo(db.IssueRequest, { foreignKey: 'issue_request_id' });
db.IssueDetail.belongsTo(db.StockItem, { foreignKey: 'stock_item_id' });

// เรียก associate() จาก model ถ้ามี
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
