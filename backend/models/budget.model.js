// models/budget.model.js
module.exports = (sequelize, DataTypes) => {
    const Budget = sequelize.define('Budget', {
      department: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      initial_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      used_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      tableName: 'budgets',
      timestamps: false
    });
  
    return Budget;
  };
  