'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chest_slots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      chest_offer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'chest_offers', key: 'id' }, onDelete: 'CASCADE' },
      slot_number: { type: Sequelize.INTEGER, allowNull: false },
      reward_type: { type: Sequelize.STRING(50), allowNull: false },

    });

    await queryInterface.addConstraint('chest_slots', { type: 'unique', name: 'uq_chest_slot_number', fields: ['chest_offer_id', 'slot_number'] });
    await queryInterface.addConstraint('chest_slots', { type: 'check', name: 'ck_slot_number_1_to_3', fields: ['slot_number'], where: { slot_number: [1, 2, 3] } });
    },

  async down(queryInterface) { 
    await queryInterface.dropTable('chest_slots'); },
  };