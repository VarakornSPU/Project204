module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    po_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      defaultValue: 'transfer'
    },
    payment_proof: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
    tableName: 'payments',
    timestamps: false,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.PurchaseOrder, { foreignKey: 'po_id' });
    Payment.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
    Payment.belongsTo(models.Vendor, { foreignKey: 'vendor_id' });
  };

  return Payment;
};
