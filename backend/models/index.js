const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const db = {};

// 📦 Load models
db.Role = require('./role.model')(sequelize, DataTypes);
db.User = require('./user.model')(sequelize, DataTypes);
db.Item = require('./item.model')(sequelize, DataTypes);
db.Vendor = require('./vendor.model')(sequelize, DataTypes);
db.PurchaseRequest = require('./purchase_requests.model')(sequelize, DataTypes); // ✅ ใช้ชื่อให้ตรงกับตาราง
db.PRDetail = require('./prdetail.model')(sequelize, DataTypes);
db.PurchaseOrder = require('./po.model')(sequelize, DataTypes);
db.POItem = require('./poitem.model')(sequelize, DataTypes);

db.PurchaseRequest.hasOne(db.PurchaseOrder, { foreignKey: 'pr_id' });
db.PurchaseOrder.belongsTo(db.PurchaseRequest, { foreignKey: 'pr_id' });


// ✅ เรียก associate ตามแต่ละ model
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
