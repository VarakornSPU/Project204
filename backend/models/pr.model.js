module.exports = (sequelize, DataTypes) => {
  const PurchaseRequest = sequelize.define("PurchaseRequest", {
    pr_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
    required_date: DataTypes.DATEONLY,
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "waiting_approval",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "purchase_requests",

    // ✅ แก้ตรงนี้
    timestamps: true,
    createdAt: "createdAt",   // ต้องตรงกับ column ใน DB
    updatedAt: "updatedAt",   // ต้องตรงกับ column ใน DB
  });

  PurchaseRequest.associate = (models) => {
    PurchaseRequest.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });

    PurchaseRequest.hasMany(models.PRDetail, {
      foreignKey: "pr_id",
      as: "items",  // หรือ 'details' แล้วแต่คุณจะใช้ชื่อไหนใน include
    });
  };

  return PurchaseRequest;
};
