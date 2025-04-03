module.exports = (sequelize, DataTypes) => {
    const PRDetail = sequelize.define('PRDetail', {
      pr_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.DECIMAL,
      total_price: DataTypes.DECIMAL,
    });
    return PRDetail;
  };
  