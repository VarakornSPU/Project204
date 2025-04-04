'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'admin' },
      { id: 2, name: 'procurement' },
      { id: 3, name: 'finance' },
      { id: 4, name: 'management' }
    ], {});
    await queryInterface.sequelize.query(`UPDATE users SET role_id = 1 WHERE role_id IS NULL;`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
