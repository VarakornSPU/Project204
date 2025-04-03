module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Vendor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: DataTypes.STRING,
    address: DataTypes.TEXT
  }, {
    tableName: 'vendors', // 👈 บอก Sequelize ให้ใช้ชื่อนี้เป๊ะๆ
    freezeTableName: true,
  });
  return Vendor;
};
