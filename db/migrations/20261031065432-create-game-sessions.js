'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      host_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' }, onDelete: 'CASCADE' },
      question_set_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'question_sets', key: 'id' }, onDelete: 'RESTRICT' },
      join_code: { type: Sequelize.STRING(10), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'WAITING' },
      duration_sec: { type: Sequelize.INTEGER, allowNull: false },
      started_at: { type: Sequelize.DATE, allowNull: true },
      ends_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      });

    await queryInterface.addConstraint('game_sessions', { type: 'check', name: 'ck_session_status', fields: ['status'], where: { status: ['WAITING', 'ACTIVE', 'ENDED'] } });
  },

  async down(queryInterface) { 
    await queryInterface.dropTable('game_sessions'); },
  };