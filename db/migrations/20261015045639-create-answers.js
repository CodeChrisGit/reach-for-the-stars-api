'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      player_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'session_players', key: 'id' }, onDelete: 'CASCADE' },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'questions', key: 'id' }, onDelete: 'CASCADE' },
      choice_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'choices', key: 'id' }, onDelete: 'SET NULL' },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false },
      answer_time_ms: { type: Sequelize.INTEGER, allowNull: false },
      stars_earned: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      streak_after: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      double_star_used: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      protection_used: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      
    });

    await queryInterface.addConstraint('answers', { type: 'unique', name: 'uq_one_answer_per_question', fields: ['player_id', 'question_id'] });
  },

  async down(queryInterface) { await queryInterface.dropTable('answers'); },
  };