const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 📦 Load models
db.Role = require('./role.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes);
db.Item = require('./item.model')(sequelize, DataTypes);
db.Vendor = require('./vendor.model')(sequelize, DataTypes);
db.PurchaseRequest = require('./pr.model')(sequelize, DataTypes);
db.PRDetail = require('./prdetail.model')(sequelize, DataTypes);
db.PurchaseOrder = require('./po.model')(sequelize, DataTypes);
db.POItem = require('./poitem.model')(sequelize, DataTypes);

// 🔗 Relationships
db.Role.hasMany(db.User, { foreignKey: 'role_id', as: 'users' });
db.User.belongsTo(db.Role, { foreignKey: 'role_id', as: 'role' });

db.PurchaseRequest.hasMany(db.PRDetail, { foreignKey: 'pr_id' });
db.PRDetail.belongsTo(db.PurchaseRequest, { foreignKey: 'pr_id' });

db.PRDetail.belongsTo(db.Item, { foreignKey: 'item_id' });
db.Item.hasMany(db.PRDetail, { foreignKey: 'item_id' });

db.PurchaseOrder.belongsTo(db.PurchaseRequest, { foreignKey: 'pr_id' });
db.PurchaseRequest.hasMany(db.PurchaseOrder, { foreignKey: 'pr_id' });

db.PurchaseOrder.belongsTo(db.Vendor, { foreignKey: 'vendor_id' });
db.Vendor.hasMany(db.PurchaseOrder, { foreignKey: 'vendor_id' });

db.PurchaseOrder.hasMany(db.POItem, { foreignKey: 'po_id', as: 'items' });
db.POItem.belongsTo(db.PurchaseOrder, { foreignKey: 'po_id' });

module.exports = db;
