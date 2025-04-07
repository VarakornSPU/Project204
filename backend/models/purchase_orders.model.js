module.exports = (sequelize, DataTypes) => {
    const PurchaseOrder = sequelize.define("PurchaseOrder", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pr_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_terms: DataTypes.STRING,
      reference_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      created_by: {
        type: DataTypes.INTEGER,
      }
    }, {
      tableName: "purchase_orders", // ✅ ชื่อตรงกับใน DB
      timestamps: false,
    });
  
    PurchaseOrder.associate = (models) => {
      PurchaseOrder.belongsTo(models.PurchaseRequest, {
        foreignKey: "pr_id",
        as: "purchase_request",
      });
  
      PurchaseOrder.belongsTo(models.Vendor, {
        foreignKey: "vendor_id",
        as: "vendor",
      });
    };
  
    return PurchaseOrder;
  };
  