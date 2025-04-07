module.exports = (sequelize, DataTypes) => {
  const PurchaseRequest = sequelize.define("PurchaseRequest", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pr_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    total_amount: DataTypes.NUMERIC,
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending_approval",
    },
    required_date: DataTypes.DATE,
    created_by: DataTypes.INTEGER,
    approved_by: DataTypes.INTEGER,
    approved_at: DataTypes.DATE,
    created_date: DataTypes.DATE,
  }, {
    tableName: "purchase_requests", // ✅ ต้องตรงกับชื่อจริงใน DB
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  PurchaseRequest.associate = (models) => {
    PurchaseRequest.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "created_user",
    });

    PurchaseRequest.belongsTo(models.User, {
      foreignKey: "approved_by",
      as: "approver",
    });

    PurchaseRequest.hasMany(models.PRDetail, {
      foreignKey: "pr_id",
      as: "pr_details",
    });

    PurchaseRequest.hasOne(models.PurchaseOrder, {
      foreignKey: 'pr_id',
      as: 'purchase_order',
    });
  };

  return PurchaseRequest;
};
