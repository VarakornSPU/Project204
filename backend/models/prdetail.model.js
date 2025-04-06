module.exports = (sequelize, DataTypes) => {
  const PRDetail = sequelize.define("PRDetail", {
    pr_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'purchase_requests',
        key: 'id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'pr_details',
    timestamps: true,
    underscored: false, // ✅ ต้องเป็น false ให้ตรงกับ DB column ที่ใช้ camelCase
  });

  PRDetail.associate = (models) => {
    PRDetail.belongsTo(models.Item, {
      foreignKey: "item_id",
      as: "item",
    });

    PRDetail.belongsTo(models.PurchaseRequest, {
      foreignKey: "pr_id",
    });
  };

  return PRDetail;
};
