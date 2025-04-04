module.exports = (sequelize, DataTypes) => {
  const PurchaseRequest = sequelize.define("PurchaseRequest", {
    pr_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    required_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "draft",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return PurchaseRequest;
};