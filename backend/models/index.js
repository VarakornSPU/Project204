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

// Payment → PurchaseOrder
db.Payment.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });
db.PurchaseOrder.hasMany(db.Payment, { foreignKey: 'po_id' });

// Payment → Invoice
db.Payment.belongsTo(db.Invoice, { foreignKey: 'invoice_id' });
db.Invoice.hasMany(db.Payment, { foreignKey: 'invoice_id' });

// Payment → Vendor
db.Payment.belongsTo(db.Vendor, { foreignKey: 'vendor_id' });
db.Vendor.hasMany(db.Payment, { foreignKey: 'vendor_id' });

// PO → Vendor
db.PurchaseOrder.belongsTo(db.Vendor, { foreignKey: 'vendor_id' });

// Receipt → PO
db.Receipt.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });
db.PurchaseOrder.hasMany(db.Receipt, { foreignKey: 'po_id' });

// เรียก associate ถ้า model นั้นมี method associate
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
