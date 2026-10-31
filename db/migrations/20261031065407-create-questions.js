'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_set_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'question_sets', key: 'id' }, onDelete: 'CASCADE' },
      position: { type: Sequelize.INTEGER, allowNull: false },
      text: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false },
      time_limit_sec: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },

    });

    await queryInterface.addConstraint('questions', { type: 'unique', name: 'uq_question_position', fields: ['question_set_id', 'position'] });

    await queryInterface.addConstraint('questions', { type: 'check', name: 'ck_question_time_positive', fields: ['time_limit_sec'], where: { time_limit_sec: { [Sequelize.Op.gt]: 0 } } });
  },
  
  async down(queryInterface) { 
    await queryInterface.dropTable('questions'); 
  },
  };