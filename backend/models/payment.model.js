module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    po_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    amount: { // ✅ ใช้ชื่อเดียวกับ DB
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_proof: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'payments',
    timestamps: false,
  });

  return Payment;
};
