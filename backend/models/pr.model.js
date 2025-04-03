module.exports = (sequelize, DataTypes) => {
  const PurchaseRequest = sequelize.define('PurchaseRequest', {
    pr_number: DataTypes.STRING,
    description: DataTypes.TEXT,
    total_amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    date: DataTypes.DATE,
  });
  return PurchaseRequest;
};
