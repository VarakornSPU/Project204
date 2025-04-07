module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    reference_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pr_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_terms: {
      type: DataTypes.STRING,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  }, {
    tableName: 'purchase_orders',
    timestamps: false, // ✅ ปิด createdAt/updatedAt
  });

  PurchaseOrder.associate = (models) => {
    PurchaseOrder.hasMany(models.POItem, {
      foreignKey: 'po_id',
      as: 'items',
    });
    PurchaseOrder.belongsTo(models.Vendor, {
      foreignKey: 'vendor_id',
    });
    PurchaseOrder.hasMany(models.Payment, {
      foreignKey: 'po_id',
    });
  };

  return PurchaseOrder;
};
