const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const db = {};

db.Role = require('./role.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes);
db.Item = require('./item.model')(sequelize, DataTypes);
db.Vendor = require('./vendor.model')(sequelize, DataTypes);
db.PurchaseRequest = require('./purchase_requests.model')(sequelize, DataTypes);
db.PRDetail = require('./prdetail.model')(sequelize, DataTypes);
db.PurchaseOrder = require('./po.model')(sequelize, DataTypes);
db.POItem = require('./poitem.model')(sequelize, DataTypes);
db.Budget = require('./budget.model')(sequelize, DataTypes);
db.Payment = require('./payment.model')(sequelize, DataTypes); // ✅ เพิ่ม model Payment
db.Receipt = require('./receipt.model')(sequelize, DataTypes);

// ✅ ความสัมพันธ์ของ Payment → PO
db.Payment.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });
db.PurchaseOrder.hasMany(db.Payment, { foreignKey: 'po_id' });

// ✅ ความสัมพันธ์ของ PO → Vendor (มีอยู่แล้วหรือเพิ่มไว้ให้แน่ใจ)
db.PurchaseOrder.belongsTo(db.Vendor, { foreignKey: 'vendor_id' });

db.Receipt.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });
db.PurchaseOrder.hasMany(db.Receipt, { foreignKey: 'po_id' });

// ✅ เรียก associate จาก model ที่กำหนดเอง (ถ้ามี)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
