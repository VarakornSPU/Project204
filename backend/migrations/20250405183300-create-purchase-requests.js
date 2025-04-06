'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pr_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      total_amount: Sequelize.NUMERIC,
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending_approval'
      },
      required_date: Sequelize.DATE,
      created_by: Sequelize.INTEGER,
      approved_by: Sequelize.INTEGER,
      approved_at: Sequelize.DATE,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('purchase_requests');
  }
};
