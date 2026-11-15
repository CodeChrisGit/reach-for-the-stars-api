'use strict';
const H = 'seed-only-not-a-real-hash';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      { 
        school_id: '2099-0002', 
        username: 'librarian2', 
        password_hash: H, 
        full_name: 'Ben Castro', 
        email: 'ben.castro@aklatarena.test', 
        role: 'HOST' 
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: '2099-0002' }, {});
  },
};