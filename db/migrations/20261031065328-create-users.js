'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false },
      role: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'PLAYER' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });
    await queryInterface.addConstraint('users', { type: 'unique', name: 'uq_users_email', fields: ['email'] });
    await queryInterface.addConstraint('users', { type: 'check', name: 'ck_users_role', fields: ['role'], where: { role: ['HOST', 'PLAYER'] } });
  },
  async down(queryInterface) { await queryInterface.dropTable('users'); },
};