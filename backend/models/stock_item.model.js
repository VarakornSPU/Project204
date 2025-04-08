module.exports = (sequelize, DataTypes) => {
    const StockItem = sequelize.define("StockItem", {
      po_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      quantity: DataTypes.INTEGER,
      unit: DataTypes.TEXT,
      min_stock: {
        type: DataTypes.INTEGER,
        defaultValue: 10
      },
      cost_per_unit: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0
      },
      received_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: "stock_items"
    });
  
    StockItem.associate = (models) => {
      StockItem.belongsTo(models.Item, { foreignKey: "item_id" });
    };
  
    return StockItem;
  };
  