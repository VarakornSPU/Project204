'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pr_details', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'purchase_requests', key: 'id' },
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Items', key: 'id' },
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pr_details');
  }
};
