'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'roles', key: 'id' }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'roles', key: 'id' }
    });
  }
};
