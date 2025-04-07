module.exports = (sequelize, DataTypes) => {
    const Receipt = sequelize.define("Receipt", {
      po_id: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.STRING },
      quantity: { type: DataTypes.INTEGER },
      unit: { type: DataTypes.STRING },
      received_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
      tableName: "receipts",     // ✅ ชื่อตารางตรงกับ DB
      timestamps: true,          // ✅ ใช้ createdAt / updatedAt
      underscored: true,         // ✅ ให้ map created_at → createdAt อัตโนมัติ
    });
  
    // ✅ ความสัมพันธ์กับ PO
    Receipt.associate = (models) => {
      Receipt.belongsTo(models.PurchaseOrder, {
        foreignKey: "po_id",
        as: "purchase_order"
      });
    };
  
    return Receipt;
  };
  