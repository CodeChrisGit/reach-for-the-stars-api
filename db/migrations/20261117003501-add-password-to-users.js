'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });

    // Older seeders stored a placeholder, not a usable password hash.
    await queryInterface.sequelize.query(
      "UPDATE users SET password_hash = NULL WHERE password_hash NOT LIKE '$2%'"
    );

    await queryInterface.removeConstraint('users', 'ck_users_role');
    await queryInterface.addConstraint('users', {
      type: 'check',
      name: 'ck_users_role',
      fields: ['role'],
      where: { role: ['HOST', 'PLAYER', 'ADMIN'] },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "UPDATE users SET password_hash = 'seed-only-not-a-real-hash' WHERE password_hash IS NULL"
    );

    await queryInterface.removeConstraint('users', 'ck_users_role');
    await queryInterface.addConstraint('users', {
      type: 'check',
      name: 'ck_users_role',
      fields: ['role'],
      where: { role: ['HOST', 'PLAYER'] },
    });
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};