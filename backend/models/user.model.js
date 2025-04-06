module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );

  User.associate = (models) => {
    // เชื่อมกับ role ด้วย alias 'role'
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role',
    });

    // เชื่อมกับ PR ที่ผู้ใช้นี้เป็นคนสร้าง (inverse ของ created_by)
    User.hasMany(models.PurchaseRequest, {
      foreignKey: 'created_by',
      as: 'created_requests',
    });
  };

  return User;
};
