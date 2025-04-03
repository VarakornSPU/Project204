module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
      name: DataTypes.STRING,
      unit_price: DataTypes.DECIMAL,
      unit: DataTypes.STRING,
      description: DataTypes.TEXT,
    });
    return Item;
  };
  