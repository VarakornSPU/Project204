module.exports = (sequelize, DataTypes) => {
    const IssueRequest = sequelize.define("IssueRequest", {
      requester_id: DataTypes.INTEGER,
      request_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      status: { type: DataTypes.STRING, defaultValue: 'pending' }
    }, {
      tableName: "issue_requests",
      timestamps: true
    });
  
    IssueRequest.associate = models => {
      // ✅ เปลี่ยน alias ให้ไม่ซ้ำ
      IssueRequest.belongsTo(models.User, { foreignKey: 'requester_id', as: 'issue_requester' });
  
      IssueRequest.hasMany(models.IssueDetail, {
        foreignKey: 'issue_request_id',
        as: 'issue_details'
      });
    };
  
    return IssueRequest;
  };
  