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

// ✅ เรียก associate จากทุก model ที่มีความสัมพันธ์
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
