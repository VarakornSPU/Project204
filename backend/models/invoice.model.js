// Project204/backend/models/invoice.model.js
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
      po_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'purchase_orders',
          key: 'id'
        }
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id'
        }
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid'
      }
    }, {
      tableName: 'invoices',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    Invoice.associate = (models) => {
      Invoice.belongsTo(models.PurchaseOrder, { foreignKey: 'po_id', as: 'po' });
      Invoice.belongsTo(models.Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
    };
  
    return Invoice;
  };
  