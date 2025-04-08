module.exports = (sequelize, DataTypes) => {
    const IssueDetail = sequelize.define("IssueDetail", {
      issue_request_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: "issue_details",
      timestamps: true
    });
  
    IssueDetail.associate = models => {
      IssueDetail.belongsTo(models.IssueRequest, {
        foreignKey: 'issue_request_id',
        as: 'request'
      });
  
      IssueDetail.belongsTo(models.StockItem, {
        foreignKey: 'stock_item_id',
        as: 'stock'
      });
    };
  
    return IssueDetail;
  };
  