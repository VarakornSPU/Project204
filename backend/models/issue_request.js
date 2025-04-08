module.exports = (sequelize, DataTypes) => {
    const IssueRequest = sequelize.define("IssueRequest", {
      requester_id: DataTypes.INTEGER,
      request_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      status: { type: DataTypes.STRING, defaultValue: 'pending' }
    }, {
      tableName: "issue_requests"
    });
  
    IssueRequest.associate = models => {
      IssueRequest.belongsTo(models.User, { foreignKey: 'requester_id', as: 'requester' });
      IssueRequest.hasMany(models.IssueDetail, { foreignKey: 'issue_request_id', as: 'details' });
    };
  
    return IssueRequest;
  };
  