'use strict';
module.exports = {
async up(queryInterface, Sequelize) {
  await queryInterface.createTable('question_sets', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    host_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'user_id' }, onDelete: 'CASCADE' },
    title: { type: Sequelize.STRING(255), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    subject: { type: Sequelize.STRING(100), allowNull: true },
    grade_level: { type: Sequelize.STRING(50), allowNull: true },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
  });

},
  async down(queryInterface) { 
    await queryInterface.dropTable('question_sets'); },
  };