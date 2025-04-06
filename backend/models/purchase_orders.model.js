module.exports = (sequelize, DataTypes) => {
    const PurchaseOrder = sequelize.define("PurchaseOrder", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reference_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pr_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: sequelize.models.PurchaseRequest, // ✅ ใช้ model object แทน string
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          

        vendor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vendors',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        payment_terms: DataTypes.STRING,
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending",
        },
    }, {
        tableName: "purchase_orders",
        timestamps: true,
    });

    PurchaseOrder.associate = (models) => {
        PurchaseOrder.belongsTo(models.PurchaseRequest, {
            foreignKey: "pr_id",
            as: "request"
        });
        PurchaseOrder.belongsTo(models.Vendor, {
            foreignKey: "vendor_id",
            as: "vendor"
        });
        PurchaseOrder.hasMany(models.POItem, {
            foreignKey: "po_id",
            as: "po_items"
        });
    };

    return PurchaseOrder;
};
