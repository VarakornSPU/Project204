module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: DataTypes.STRING,
    unit_price: DataTypes.DECIMAL,
    unit: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    tableName: 'Items', // 👈 สำคัญ! ให้ตรงกับชื่อจริงใน DB
    timestamps: true
  });

  Item.associate = (models) => {
    Item.hasMany(models.PRDetail, {
      foreignKey: 'item_id',
      as: 'pr_details'
    });

    // 👇 เพิ่มความสัมพันธ์กับ StockItem
    Item.hasMany(models.StockItem, {
      foreignKey: 'item_id',
      as: 'stock_items'
    });
  };

  return Item;
};
