'use strict';
module.exports = {
  async up( queryInterface, Sequelize) {
    await queryInterface.createTable('chest_offers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      answer_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, references: { model: 'answers', key: 'id' }, onDelete: 'CASCADE' },
      player_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'session_players', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'PENDING' },
      picked_slot: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      opened_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint('chest_offers', { type: 'check', name: 'ck_chest_status', fields: ['status'], where: { status: ['PENDING', 'OPENED', 'EXPIRED'] } });
    },

  async down(queryInterface) { 
    await queryInterface.dropTable('chest_offers'); },
  };