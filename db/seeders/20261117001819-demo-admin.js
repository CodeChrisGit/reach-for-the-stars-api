'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      school_id: '2099-0099',
      username: 'librarian-admin',
      password_hash: null,
      full_name: 'Demo Administrator',
      email: 'admin@demo.test',
      role: 'ADMIN',
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0099' }, {});
  },
};
