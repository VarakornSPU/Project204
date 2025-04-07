module.exports = (sequelize, DataTypes) => {
  const POItem = sequelize.define('POItem', {
    po_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: DataTypes.STRING,
    unit: DataTypes.STRING,
    unit_price: DataTypes.DECIMAL(10, 2),
    quantity: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
  }, {
    tableName: 'po_items',
    timestamps: false, // ✅ ปิด createdAt/updatedAt
  });

  POItem.associate = (models) => {
    POItem.belongsTo(models.PurchaseOrder, {
      foreignKey: 'po_id',
    });
  };

  return POItem;
};
