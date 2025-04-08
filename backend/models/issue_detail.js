module.exports = (sequelize, DataTypes) => {
    const IssueDetail = sequelize.define("IssueDetail", {
      issue_request_id: DataTypes.INTEGER,
      stock_item_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER
    }, {
      tableName: "issue_details"
    });
  
    IssueDetail.associate = models => {
      IssueDetail.belongsTo(models.IssueRequest, { foreignKey: 'issue_request_id' });
      IssueDetail.belongsTo(models.StockItem, { foreignKey: 'stock_item_id' });
    };
  
    return IssueDetail;
  };
  