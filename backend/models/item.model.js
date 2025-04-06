module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    unit_price: DataTypes.DECIMAL,
    unit: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    tableName: 'Items', // แนะนำให้ใส่ชื่อตารางไว้ชัดเจน
    timestamps: true
  });

  Item.associate = (models) => {
    Item.hasMany(models.PRDetail, {
      foreignKey: 'item_id',
      as: 'pr_details'
    });
  };

  return Item;
};
