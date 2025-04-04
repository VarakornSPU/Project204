'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      INSERT INTO roles (id, name)
      SELECT * FROM (VALUES
        (1, 'admin'),
        (2, 'procurement'),
        (3, 'finance'),
        (4, 'management'),
        (5, 'it')
      ) AS vals(id, name)
      WHERE NOT EXISTS (
        SELECT 1 FROM roles WHERE roles.id = vals.id
      );
    `);

    await queryInterface.sequelize.query(`
      UPDATE users SET role_id = 1 WHERE role_id IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // ✅ 1. ลบ NOT NULL constraint ชั่วคราว
    await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN role_id DROP NOT NULL;
    `);

    // ✅ 2. ล้างค่า role_id เพื่อให้ลบ roles ได้
    await queryInterface.sequelize.query(`
      UPDATE users SET role_id = NULL WHERE role_id IN (1, 2, 3, 4, 5);
    `);

    // ✅ 3. ลบ roles
    await queryInterface.bulkDelete('roles', {
      name: ['admin', 'procurement', 'finance', 'management', 'it']
    }, {});
  }
};
